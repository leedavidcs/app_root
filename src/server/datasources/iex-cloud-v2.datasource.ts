import type { IServerContextWithUser } from "@/server/graphql";
import { DataSource, DataSourceConfig } from "apollo-datasource";
import { mapLimit, mapSeries } from "blend-promise-utils";
import DataLoader from "dataloader";
import { chunk, groupBy, head, intersection } from "lodash";
import fetch from "node-fetch";
import IEXCloudClient from "node-iex-cloud";
import Batch from "node-iex-cloud/lib/batch";
import Stock from "node-iex-cloud/lib/stock";
import { Last, Range } from "node-iex-cloud/lib/types";
import objectHash from "node-object-hash";
import PQueue from "p-queue";

interface ISymbolOptions {
	last: Last;
	mock: boolean;
	range: Range;
}

const DEFAULT_SYMBOL_OPTIONS: ISymbolOptions = {
	last: 1,
	mock: false,
	range: "1m"
};

const isDevelopment: boolean = process.env.NODE_ENV !== "production";
const publishable: string = process.env.IEXCLOUD_SECRET_KEY || "";
const version = "stable";
const sandboxPublishable: string = process.env.IEXCLOUD_SANDBOX_PUBLIC_KEY || "";

/** IEX-Cloud has a request limit of 1 request / 10 ms */
const IEX_REQUEST_RATE_LIMIT = 10;
const MAX_SYMBOL_BATCH_SIZE = 100;
const MAX_FIELD_BATCH_SIZE = 8;
const BATCHES_CONCURRENCY = 3;

type IexType = Exclude<keyof Batch, "req" | "batching" | "range">;
type IexResultsMap = { [P in IexType]: UnPromise<ReturnType<Stock[P]>> };
type FieldData<TFields extends IexType> = { [F in TFields]: IexResultsMap[F] };
type SymbolPayload<TSymbols extends string, TFields extends IexType> = {
	[P in TSymbols]: FieldData<TFields>;
};

interface ISymbolInput {
	symbol: string;
	field: IexType;
	options?: Partial<ISymbolOptions>;
}

interface IBatchSymbolsParams<TSymbols extends string, TFields extends IexType> {
	symbols: readonly TSymbols[];
	fields: readonly TFields[];
	options?: ISymbolOptions;
}

const queue = new PQueue({
	concurrency: 1,
	/** Double the interval for IEX-Cloud's rate limit, for safety */
	interval: IEX_REQUEST_RATE_LIMIT * 2,
	intervalCap: 1
});

const hasher = objectHash({ sort: true, coerce: false, trim: true });

export class IexCloudAPI extends DataSource<IServerContextWithUser> {
	private context!: IServerContextWithUser;

	private client = new IEXCloudClient(fetch, {
		sandbox: isDevelopment,
		publishable: isDevelopment ? sandboxPublishable : publishable,
		version
	});

	private mockClient = new IEXCloudClient(fetch, {
		sandbox: true,
		publishable: sandboxPublishable,
		version
	});

	public symbol = new DataLoader(
		async (keys: readonly ISymbolInput[]) => {
			/**
			 * @description Map each key to contain non-null options and a unique hash for options
			 *     by value. This is because each difference in options will incur a different
			 *     batch request
			 */
			const withOptionsHash = keys.map((key) => {
				const options = this.withDefaultOptions(key.options);

				const optionsHash: string = hasher.hash(options);

				return { ...key, options, optionsHash };
			});

			const groupedByOptions = groupBy(withOptionsHash, "optionsHash");

			const optsDict = withOptionsHash.reduce(
				(dict, { optionsHash, options }) => ({ ...dict, [optionsHash]: options }),
				{} as Record<string, ISymbolOptions>
			);

			const batchesArray = await mapLimit(
				Object.entries(groupedByOptions),
				BATCHES_CONCURRENCY,
				async ([optsHash, inputs]) => {
					const symbols: string[] = inputs.map(({ symbol }) => symbol);
					const fields: IexType[] = inputs.map(({ field }) => field);
					const options: ISymbolOptions = this.withDefaultOptions(head(inputs)?.options);

					const batches = await this.batchSymbols({ symbols, fields, options });

					return [optsHash, batches] as [string, SymbolPayload<string, IexType>];
				}
			);

			/**
			 * @description Create a dict of optsHash'es to symbol payloads (dict of symbols, to
			 *     fields)
			 */
			const batchesDict = batchesArray.reduce(
				(acc, [optsHash, batches]) => ({ ...acc, [optsHash]: batches }),
				{} as Record<string, SymbolPayload<string, IexType>>
			);

			/**
			 * @description Prime results for all options, symbols and fields. This is done because
			 *     results are overfetched if multiple symbols have a different set of requested
			 *     fields, since all fields are requested for all symbols.
			 */
			Object.entries(batchesDict).forEach(([optsHash, symbolPayload]) => {
				const options = optsDict[optsHash];

				Object.entries(symbolPayload).forEach(([symbol, results]) => {
					(Object.keys(results) as IexType[]).forEach((field) => {
						const symbolInput: ISymbolInput = { options, symbol, field };

						const fieldData = batchesDict[optsHash]?.[symbol]?.[field] ?? null;

						this.symbol.prime(symbolInput, fieldData);
					});
				});
			});

			/**
			 * @description Sort results back in the same order as the keys provided (required by
			 *     DataLoader). Return null as fallback.
			 */
			const finalResults: any[] = withOptionsHash.map(({ optionsHash, symbol, field }) => {
				const fieldData = batchesDict[optionsHash]?.[symbol]?.[field] ?? null;

				return fieldData;
			});

			return finalResults;
		},
		{
			cacheKeyFn: (key: ISymbolInput) => {
				return hasher.hash({ ...key, options: this.withDefaultOptions(key.options) });
			}
		}
	);

	public initialize = (config: DataSourceConfig<IServerContextWithUser>) => {
		this.context = config.context;
	};

	private withDefaultOptions = (
		options: Partial<ISymbolOptions> | undefined
	): ISymbolOptions => ({
		...DEFAULT_SYMBOL_OPTIONS,
		...options
	});

	/**
	 * @description For a given list of symbols, retrieve data for selected fields and options.
	 *     This method handles batching symbols and fields under-the-hood, and returns results as
	 *     if a single request were made to IexCloud's batching API, but without symbol and field
	 *     limits.
	 */
	private batchSymbols = async <TSymbols extends string, TFields extends IexType>(
		params: IBatchSymbolsParams<TSymbols, TFields>
	): Promise<SymbolPayload<TSymbols, TFields>> => {
		const { symbols, fields, options } = params;

		const _options = { ...DEFAULT_SYMBOL_OPTIONS, ...options };

		// Narrow symbols and fields to unique values to reduce requests/costs to IexCloud
		const uniqueSymbols = Array.from(new Set(symbols));
		const uniqueFields = Array.from(new Set(fields));

		// Abide by symbol and field batch limits (enforced by IexCloud)
		const symbolBatches: TSymbols[][] = chunk(uniqueSymbols, MAX_SYMBOL_BATCH_SIZE);
		const fieldBatches: TFields[][] = chunk(uniqueFields, MAX_FIELD_BATCH_SIZE);

		/**
		 * @description For a given batch of symbols, retrieve data for selected fields for each.
		 *     This produces a dictionary of symbols (as keys) to fields.
		 */
		const resolveFields = (
			symbolBatch: TSymbols[],
			fieldBatch: TFields[]
		): Promise<SymbolPayload<TSymbols, TFields>> => {
			const client: IEXCloudClient = _options.mock ? this.mockClient : this.client;
			const batch: Batch = client.batchSymbols(...symbolBatch).batch();

			const withFields: Batch = fieldBatch.reduce<Batch>((currentBatch, iexField) => {
				const fieldFunc: () => Batch = currentBatch[iexField];

				const withAddedFields: Batch = fieldFunc?.() ?? currentBatch;

				return withAddedFields;
			}, batch);

			const evaled = queue.add<SymbolPayload<TSymbols, TFields>>(() =>
				withFields.range(_options.range, _options.last)
			);

			return evaled;
		};

		const mergedResults = await mapSeries(symbolBatches, async (symbolBatch) => {
			return mapSeries(fieldBatches, (fieldBatch) =>
				resolveFields(symbolBatch, fieldBatch)
			).then(this.mergeResults);
		}).then(this.mergeResults);

		return mergedResults;
	};

	/**
	 * @description Merges results from multiple calls from `resolveFields`. Results from
	 *     `resolveFields` are in the shape of { [symbol: string]: { [fieldName: string]: any } }[],
	 *     such that it is expected that each item of this array consists of the same symbols, but
	 *     with different fields. This merges the field data for each symbol, under a single object.
	 */
	private mergeResults = <T extends Record<string, any>>(results: readonly T[]): T => {
		const final = results.reduce((source, nextResult) => {
			const sourceTickers = Object.keys(source);
			const newTickers = Object.keys(nextResult);

			const sameTickers = intersection(sourceTickers, newTickers);

			const result = sameTickers.reduce(
				(acc, nextTicker) => {
					const withNewTypes = { ...source[nextTicker], ...nextResult[nextTicker] };
					const withUpdatedTicker = { ...acc, [nextTicker]: withNewTypes };

					return withUpdatedTicker;
				},
				{ ...source, ...nextResult }
			);

			return result;
		});

		return final;
	};
}
