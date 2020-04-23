import { SnapshotConfig, StockDataFeatures } from "@/server/configs";
import { IexType } from "@/server/datasources";
import { IServerContextWithUser } from "@/server/graphql/context";
import { Logger, NotFoundError } from "@/server/utils";
import { booleanArg, objectType } from "@nexus/schema";
import { Snapshot, StockPortfolio, StockPortfolioSettings, Transaction } from "@prisma/client";
import { ForbiddenError, UserInputError } from "apollo-server-micro";
import { oneLine } from "common-tags";
import { camelCase, get } from "lodash";

type StockPortfolioWithSettings = StockPortfolio & { settings: StockPortfolioSettings };

const getDataKeys = (stockPortfolio: StockPortfolioWithSettings): readonly string[] => {
	const dataKeys: readonly string[] = stockPortfolio.headers.map((header) => {
		const { dataKey } = JSON.parse(header);

		return dataKey;
	});

	return dataKeys;
};

const getTypes = (dataKeys: readonly string[]): Record<IexType, boolean> => {
	const types: Record<IexType, boolean> = dataKeys
		.map((dataKey) => camelCase(dataKey.split(".")[0]))
		.reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<IexType, boolean>);

	return types;
};

const limitResultToDataKeys = (
	result: Record<string, any>,
	dataKeys: readonly string[]
): Record<string, any> => {
	return dataKeys.reduce((acc, dataKey) => ({ ...acc, [dataKey]: get(result, dataKey) }), {});
};

const computeCosts = (stockPortfolio: StockPortfolioWithSettings): number => {
	const { headers, tickers } = stockPortfolio;

	const dataKeys: readonly string[] = headers.map((header) => {
		const { dataKey } = JSON.parse(header);

		return dataKey;
	});

	const multiplier: number = tickers.length;

	const types: readonly IexType[] = Object.keys(getTypes(dataKeys)) as IexType[];

	const snapshotCost: number = stockPortfolio.settings.enableSnapshots ? SnapshotConfig.price : 0;
	const dataCost: number = types.reduce((acc, type) => acc + StockDataFeatures[type].cost, 0);

	const totalCost: number = snapshotCost + dataCost;

	return multiplier * totalCost;
};

const createTransaction = async (
	cost: number,
	{ prisma, user }: IServerContextWithUser
): Promise<Maybe<Transaction>> => {
	if (cost === 0) {
		return null;
	}

	const balance = await prisma.balance.findOne({ where: { userId: user?.id } });

	if (!balance || balance.credits < cost) {
		throw new ForbiddenError("You have insufficient funds for this request.");
	}

	await prisma.balance.update({
		data: { credits: balance.credits - cost },
		where: { userId: user.id }
	});

	return await prisma.transaction.create({
		data: {
			creditsBefore: balance.credits,
			creditsTransacted: -cost,
			user: { connect: { id: user.id } }
		}
	});
};

const shouldCreateSnapshot = (stockPortfolio: StockPortfolioWithSettings): boolean => {
	return stockPortfolio.settings.enableSnapshots;
};

const createSnapshot = async (
	stockPortfolio: StockPortfolio,
	data: readonly Record<string, any>[],
	{ prisma }: IServerContextWithUser
): Promise<Snapshot> => {
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

const mapToStockPortfolio = (
	data: Record<string, Record<string, any>>,
	stockPortfolio: StockPortfolioWithSettings
): Record<string, any>[] => {
	const { tickers } = stockPortfolio;
	const dataKeys: readonly string[] = getDataKeys(stockPortfolio);

	return tickers.map((ticker) => {
		return { ticker, ...limitResultToDataKeys(data[ticker], dataKeys) };
	});
};

export const StockData = objectType({
	name: "StockData",
	description: oneLine`
		The data for a stock-portfolio, derived from its headers and tickers. Accessing the \`data\`
		prop of this type will incur a transaction for the \`viewer\` of this request
	`,
	definition: (t) => {
		t.field("stockPortfolio", {
			type: "StockPortfolio",
			nullable: false,
			description: oneLine`
				The stock portfolio for which this data is being generated for. If provided, \
				snapshots may be created depending on the stock-portfolio's settings.
			`
		});
		t.int("refreshCost", {
			description: "The amount in credits, that a data-refresh would cost",
			nullable: false,
			args: {
				enableSnapshots: booleanArg()
			},
			resolve: async ({ stockPortfolio: { id } }, args, context) => {
				const { prisma } = context;

				const stockPortfolio = await prisma.stockPortfolio.findOne({
					where: { id },
					include: { settings: true }
				});

				if (!stockPortfolio) {
					throw new NotFoundError();
				}

				const cost: number = computeCosts(stockPortfolio);

				return cost;
			}
		});
		t.list.field("data", {
			type: "JSONObject",
			list: true,
			description: oneLine`
				The data for this stock-portfolio. Accessing this property incurs a transaction for
				the viewer of this request
			`,
			authorize: (parent, args, { user }) => Boolean(user),
			/**
			 * @description With complexity = 300 and maxComplexity = 500, data can be requested
			 *     once per request
			 * @author David Lee
			 * @date April 23, 2020
			 */
			complexity: 300,
			resolve: async ({ stockPortfolio: { id, tickers } }, arg, context) => {
				const { dataSources, prisma } = context;
				const { IexCloudAPI } = dataSources;

				const stockPortfolio = await prisma.stockPortfolio.findOne({
					where: { id },
					include: { settings: true }
				});

				if (!stockPortfolio) {
					throw new NotFoundError();
				}

				const cost: number = computeCosts(stockPortfolio);

				const dataKeys: readonly string[] = getDataKeys(stockPortfolio);
				const types: Record<IexType, boolean> = getTypes(dataKeys);

				let results: Record<string, Record<string, any>>;
				try {
					results = await IexCloudAPI.symbols(tickers, types);
				} catch (err) {
					const message: string = err instanceof Error ? err.message : err;

					Logger.error(message);

					throw new UserInputError("Could not get data. Inputs may be invalid", {
						invalidArgs: []
					});
				}

				await createTransaction(cost, context);

				const mapped: Record<string, any>[] = mapToStockPortfolio(results, stockPortfolio);

				if (shouldCreateSnapshot(stockPortfolio)) {
					await createSnapshot(stockPortfolio, mapped, context);
				}

				return mapped;
			}
		});
	}
});
