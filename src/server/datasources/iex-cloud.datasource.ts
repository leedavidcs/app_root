import { SnapshotConfig, StockDataFeatures } from "@/server/configs";
import { IServerContextWithUser } from "@/server/graphql";
import { NotFoundError } from "@/server/utils";
import {
	Snapshot,
	StockPortfolio,
	StockPortfolioSettings,
	Transaction,
	User,
	WebhookType
} from "@prisma/client";
import { DataSource, DataSourceConfig } from "apollo-datasource";
import { ForbiddenError, UserInputError } from "apollo-server-micro";
import { mapSeries } from "blend-promise-utils";
import { camelCase, chunk, get, intersection } from "lodash";
import fetch from "node-fetch";
import { IEXCloudClient } from "node-iex-cloud";
import Batch from "node-iex-cloud/lib/batch";
import Stock from "node-iex-cloud/lib/stock";
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

export type IexType = Exclude<keyof Batch, "req" | "batching" | "range">;

type IexResultsMap = { [P in IexType]: UnPromise<ReturnType<Stock[P]>> };

type IexSelect<T extends IexType> = Partial<{ [P in T]: boolean | null | undefined }>;

interface ISymbolsParams<TTickers extends string, TSelect extends IexType> {
	symbols: readonly TTickers[];
	select: IexSelect<TSelect>;
	options?: Partial<ISymbolsOptions>;
}

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

	/** Ensure that data can be retrieved for given symbols */
	public async areSymbolsValid(symbols: readonly string[]) {
		try {
			const result = await this.symbols({
				symbols,
				select: { price: true },
				options: { mock: true }
			});

			return Object.keys(result).length === symbols.length;
		} catch (err) {
			return false;
		}
	}

	public search(text: string) {
		return queue.add(() => this.client.search(text));
	}

	public async symbols<TSymbols extends string, TSelect extends IexType>(
		params: ISymbolsParams<TSymbols, TSelect>
	): Promise<{ [P in TSymbols]: { [S in TSelect]: IexResultsMap[S] } }> {
		type SymbolPayload = { [P in TSymbols]: { [S in TSelect]: IexResultsMap[S] } };

		const { symbols, select, options } = params;

		const _options: ISymbolsOptions = { ...DEFAULT_SYMBOLS_OPTIONS, ...options };

		const symbolBatches = chunk(symbols, MAX_SYMBOL_BATCH_SIZE);

		const iexTypes = (Object.keys(select) as TSelect[])
			.filter((key) => Boolean(select[key]))
			.sort();
		const typeBatches = chunk(iexTypes, MAX_TYPE_BATCH_SIZE);

		const resolveTypes = (symbolBatch: readonly TSymbols[], typeBatch: readonly TSelect[]) => {
			const client: IEXCloudClient = _options.mock ? this.mockClient : this.client;
			const batch: Batch = client.batchSymbols(...symbolBatch).batch();

			const withAllTypes: Batch = typeBatch.reduce<Batch>((currentBatch, iexType) => {
				const typeFunction: () => Batch = currentBatch[iexType];

				const withAddedTypes: Batch = typeFunction();

				return withAddedTypes;
			}, batch);

			const evaled = queue.add(() => withAllTypes.range(_options.range, _options.last));

			return evaled as Promise<SymbolPayload>;
		};

		const mergedResults = mapSeries(symbolBatches, async (symbolBatch) => {
			return mapSeries(typeBatches, (typeBatch) => resolveTypes(symbolBatch, typeBatch)).then(
				this.mergeResults
			);
		}).then(this.mergeResults);

		return mergedResults;
	}

	public async getStockPortfolioData(
		{ id, tickers }: Pick<StockPortfolio, "id" | "tickers">,
		requester?: Pick<User, "id">
	): Promise<Record<string, any>[]> {
		const { prisma, user } = this.context;
		const userToCharge: Pick<User, "id"> = requester ?? user;

		const stockPortfolio = await prisma.stockPortfolio.findOne({
			where: { id },
			include: { settings: true }
		});

		if (!stockPortfolio) {
			throw new NotFoundError();
		}

		const cost: number = this.computeCosts(stockPortfolio);

		const dataKeys: readonly string[] = this.getDataKeys(stockPortfolio);
		const types: Record<IexType, boolean> = this.getTypes(dataKeys);

		let results: Record<string, Record<string, any>>;
		try {
			results = await this.symbols({ symbols: tickers, select: types });
		} catch (err) {
			throw new UserInputError("Could not get data. Inputs may be invalid", {
				invalidArgs: []
			});
		}

		await this.createTransaction(cost, userToCharge);

		const mapped: Record<string, any>[] = this.mapToStockPortfolio(results, stockPortfolio);

		if (stockPortfolio.settings.enableSnapshots) {
			await this.createSnapshot(stockPortfolio, mapped);
		}

		await this.upsertLatestSnapshot(stockPortfolio, mapped);

		await this.context.webhooks.sendMany({
			where: {
				stockPortfolioId: id,
				type: WebhookType.StockDataRetrieved
			}
		});

		return mapped;
	}

	public computeCosts = (
		stockPortfolio: StockPortfolio & { settings: StockPortfolioSettings }
	): number => {
		const { headers, tickers } = stockPortfolio;

		const dataKeys: readonly string[] = headers.map((header) => {
			const { dataKey } = JSON.parse(header);

			return dataKey;
		});

		const multiplier: number = tickers.length;

		const types: readonly IexType[] = Object.keys(this.getTypes(dataKeys)) as IexType[];

		const snapshotCost: number = stockPortfolio.settings.enableSnapshots
			? SnapshotConfig.price
			: 0;
		const dataCost: number = types.reduce((acc, type) => acc + StockDataFeatures[type].cost, 0);

		const totalCost: number = snapshotCost + dataCost;

		return multiplier * totalCost;
	};

	private getTypes = (dataKeys: readonly string[]): Record<IexType, boolean> => {
		const types: Record<IexType, boolean> = dataKeys
			.map((dataKey) => camelCase(dataKey.split(".")[0]))
			.reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<IexType, boolean>);

		return types;
	};

	private getDataKeys = (stockPortfolio: StockPortfolio): readonly string[] => {
		const dataKeys: readonly string[] = stockPortfolio.headers.map((header) => {
			const { dataKey } = JSON.parse(header);

			return dataKey;
		});

		return dataKeys;
	};

	private createTransaction = async (
		cost: number,
		userToCharge: Pick<User, "id">
	): Promise<Maybe<Transaction>> => {
		const { prisma } = this.context;

		if (cost <= 0) {
			return null;
		}

		const balance = await prisma.balance.findOne({ where: { userId: userToCharge.id } });

		if (!balance || balance.credits < cost) {
			throw new ForbiddenError("You have insufficient funds for this request");
		}

		await prisma.balance.update({
			where: { userId: userToCharge.id },
			data: { credits: balance.credits - cost }
		});

		return prisma.transaction.create({
			data: {
				creditsBefore: balance.credits,
				creditsTransacted: -cost,
				user: { connect: { id: userToCharge.id } }
			}
		});
	};

	private limitResultToDataKeys = (
		result: Record<string, any>,
		dataKeys: readonly string[]
	): Record<string, any> => {
		return dataKeys.reduce((acc, dataKey) => ({ ...acc, [dataKey]: get(result, dataKey) }), {});
	};

	private mapToStockPortfolio = (
		data: Record<string, Record<string, any>>,
		stockPortfolio: StockPortfolio
	): Record<string, any>[] => {
		const { tickers } = stockPortfolio;
		const dataKeys: readonly string[] = this.getDataKeys(stockPortfolio);

		return tickers.map((ticker) => {
			return { ticker, ...this.limitResultToDataKeys(data[ticker], dataKeys) };
		});
	};

	private upsertLatestSnapshot = async (
		{ headers, id, tickers }: StockPortfolio,
		data: readonly Record<string, any>[]
	): Promise<Snapshot> => {
		const { prisma } = this.context;

		const newHeaders: string[] = headers.map((header) => {
			const { name, dataKey } = JSON.parse(header);

			return JSON.stringify({ name, dataKey });
		});
		const newData: string[] = data.map((datum) => JSON.stringify(datum));

		const latest = await prisma.latestSnapshot.upsert({
			where: { stockPortfolioId: id },
			create: {
				stockPortfolio: { connect: { id } },
				snapshot: {
					create: {
						stockPortfolio: { connect: { id } },
						tickers: { set: tickers },
						headers: { set: newHeaders },
						data: { set: newData }
					}
				}
			},
			update: {
				snapshot: {
					upsert: {
						create: {
							stockPortfolio: { connect: { id } },
							tickers: { set: tickers },
							headers: { set: newHeaders },
							data: { set: newData }
						},
						update: {
							tickers: { set: tickers },
							headers: { set: newHeaders },
							data: { set: newData },
							createdAt: new Date()
						}
					}
				}
			},
			include: { snapshot: true }
		});

		return latest.snapshot;
	};

	private createSnapshot = async (
		stockPortfolio: StockPortfolio,
		data: readonly Record<string, any>[]
	): Promise<Snapshot> => {
		const { prisma } = this.context;

		return prisma.snapshot.create({
			data: {
				stockPortfolio: { connect: { id: stockPortfolio.id } },
				tickers: { set: stockPortfolio.tickers },
				headers: {
					set: stockPortfolio.headers.map((header) => {
						const { name, dataKey } = JSON.parse(header);

						return JSON.stringify({ name, dataKey });
					})
				},
				data: { set: data.map((datum) => JSON.stringify(datum)) }
			}
		});
	};

	/** Merge results from multiple calls from `resolveTypes` */
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

	public initialize = (config: DataSourceConfig<IServerContextWithUser>) => {
		this.context = config.context;
	};
}
