import { DataSource } from "apollo-datasource";
import { mapSeries } from "blend-promise-utils";
import fetch from "isomorphic-unfetch";
import { chunk, intersection } from "lodash";
import { IEXCloudClient } from "node-iex-cloud";
import Batch from "node-iex-cloud/lib/batch";
import { Last, Range } from "node-iex-cloud/lib/types";
import PQueue from "p-queue";

const MAX_SYMBOL_BATCH_SIZE = 100;
const MAX_TYPE_BATCH_SIZE = 8;
/** IEX-Cloud has a request limit of 1 request/10 ms. We are doubling that for safety */
const IEX_REQUEST_RATE_LIMIT = 20;

const isDevelopment: boolean = process.env.NODE_ENV !== "production";
const publishable: string = process.env.IEXCLOUD_SECRET_KEY || "";
const version = "stable";
const sandboxPublishable: string = process.env.IEXCLOUD_SANDBOX_PUBLIC_KEY || "";

interface ISymbolsOptions {
	last: Last;
	mock: boolean;
	range: Range;
}

type IexType = Exclude<keyof Batch, "req" | "batching" | "range">;
type IexStockResult = Partial<Record<IexType, any>>;

const queue = new PQueue({
	concurrency: 1,
	interval: IEX_REQUEST_RATE_LIMIT,
	intervalCap: 1
});

const DEFAULT_SYMBOLS_OPTIONS: ISymbolsOptions = {
	last: 1,
	mock: false,
	range: "1m"
};

export class IexCloudAPI extends DataSource {
	private _client = new IEXCloudClient(fetch, {
		sandbox: isDevelopment,
		publishable: isDevelopment ? sandboxPublishable : publishable,
		version
	});

	private _mockClient = new IEXCloudClient(fetch, {
		sandbox: true,
		publishable: sandboxPublishable,
		version
	});

	public search(text: string) {
		return queue.add(() => this._client.search(text));
	}

	public async symbols(
		symbols: readonly string[],
		types: Partial<Record<IexType, boolean>>,
		options: Partial<ISymbolsOptions> = {}
	): Promise<Record<string, IexStockResult>> {
		const _options: ISymbolsOptions = { ...DEFAULT_SYMBOLS_OPTIONS, ...options };

		/** Split symbols up into batches, defined by request limits of iex-cloud */
		const symbolBatches: readonly (readonly string[])[] = chunk(symbols, MAX_SYMBOL_BATCH_SIZE);

		/** Split types up into batches, defined by request limits of iex-cloud */
		const iexTypes = Object.keys(types)
			.filter((key) => types[key])
			.sort() as readonly IexType[];
		const typeBatches: readonly (readonly IexType[])[] = chunk(iexTypes, MAX_TYPE_BATCH_SIZE);

		/** Resolve all data for  given symbols and types */
		const resolveTypes = (symbolBatch: readonly string[], typeBatch: readonly IexType[]) => {
			const client: IEXCloudClient = _options.mock ? this._mockClient : this._client;
			const batch: Batch = client.batchSymbols(...symbolBatch).batch();

			const withAllTypes: Batch = typeBatch.reduce<Batch>((currentBatch, iexType) => {
				const typeFunction: () => Batch = currentBatch[iexType];

				const withAddedTypes: Batch = typeFunction();

				return withAddedTypes;
			}, batch);

			/** Add to the delayed-queue to ensure not exceeding iex-cloud request limits */
			const evaled = queue.add(() => withAllTypes.range(_options.range, _options.last));

			return evaled;
		};

		const mergedResults = mapSeries(symbolBatches, async (symbolBatch) => {
			return mapSeries(typeBatches, (typeBatch) => resolveTypes(symbolBatch, typeBatch)).then(
				this.mergeResults
			);
		}).then(this.mergeResults);

		return mergedResults;
	}

	/** Merge results from multiple calls from `resolveTypes` */
	private mergeResults = (results: readonly Record<string, IexStockResult>[]) => {
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
				{ ...source, ...nextResult } as Record<string, IexStockResult>
			);

			return result;
		});

		return final;
	};
}
