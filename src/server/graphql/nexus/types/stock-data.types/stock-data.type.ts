import { StockDataFeatures } from "@/server/configs";
import { IexType } from "@/server/datasources";
import { IServerContextWithUser } from "@/server/graphql/context";
import { BadInputError, Logger } from "@/server/utils";
import { objectType } from "@nexus/schema";
import { ForbiddenError } from "apollo-server-micro";
import { camelCase, get } from "lodash";

const getTypesFromDataKeys = (dataKeys: readonly string[]): Record<IexType, boolean> => {
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

const computeCosts = (tickers: readonly string[], dataKeys: readonly string[]): number => {
	const multiplier: number = tickers.length;

	const types: readonly IexType[] = Object.keys(getTypesFromDataKeys(dataKeys)) as IexType[];

	const cost: number = types.reduce((acc, type) => acc + StockDataFeatures[type].cost, 0);

	return multiplier * cost;
};

const makeTransaction = async (cost: number, { prisma, user }: IServerContextWithUser) => {
	if (cost === 0) {
		return;
	}

	const balance = await prisma.balance.findOne({ where: { userId: user?.id } });

	if (!balance || balance.credits < cost) {
		throw new ForbiddenError("You have insufficient funds for this request.");
	}

	await prisma.balance.update({
		data: { credits: balance.credits - cost },
		where: { userId: user.id }
	});

	await prisma.transaction.create({
		data: {
			creditsBefore: balance.credits,
			creditsTransacted: -cost,
			user: { connect: { id: user.id } }
		}
	});
};

const createSnapshot = async (
	stockPortfolioId: Maybe<string>,
	data: readonly Record<string, any>[],
	{ prisma }: IServerContextWithUser
): Promise<void> => {
	if (!stockPortfolioId) {
		return;
	}

	const stockPortfolio = await prisma.stockPortfolio.findOne({
		where: { id: stockPortfolioId },
		include: { settings: true }
	});

	if (!stockPortfolio?.settings?.enableSnapshots) {
		return;
	}

	await prisma.snapshot.create({
		data: {
			stockPortfolio: { connect: { id: stockPortfolioId } },
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

export const StockData = objectType({
	name: "StockData",
	definition: (t) => {
		t.string("stockPortfolioId", {
			description:
				"The id of the stock-portfolio that this data is being generated for. If provided, \
				snapshots may be created depending on the stock-portfolio's settings."
		});
		t.list.string("tickers", { nullable: false });
		t.list.string("dataKeys", { nullable: false });
		t.int("refreshCost", {
			description: "The amount in credits, that a data-refresh would cost",
			nullable: false,
			resolve: ({ dataKeys, tickers }) => computeCosts(tickers, dataKeys)
		});
		t.list.field("data", {
			type: "JSONObject",
			authorize: async ({ dataKeys, tickers }, args, { prisma, user }) => {
				if (!user) {
					return false;
				}

				const cost: number = computeCosts(tickers, dataKeys);

				if (cost === 0) {
					return true;
				}

				const balance = await prisma.balance.findOne({ where: { userId: user.id } });

				if (!balance || balance.credits < cost) {
					return new ForbiddenError("You have insufficient funds for this request.");
				}

				return true;
			},
			resolve: async ({ stockPortfolioId, tickers, dataKeys }, arg, context) => {
				const { dataSources } = context;
				const { IexCloudAPI } = dataSources;

				const types = getTypesFromDataKeys(dataKeys);

				const cost: number = computeCosts(tickers, dataKeys);

				let results: Record<string, Record<string, any>>;
				try {
					results = await IexCloudAPI.symbols(tickers, types);
				} catch (err) {
					const message: string = err instanceof Error ? err.message : err;

					Logger.error(message);

					throw new BadInputError("Could not get data. Inputs may be invalid");
				}

				await makeTransaction(cost, context);

				const stockDataResult: Record<string, any>[] = tickers.map((ticker) => {
					return { ticker, ...limitResultToDataKeys(results[ticker], dataKeys) };
				});

				await createSnapshot(stockPortfolioId, stockDataResult, context);

				return stockDataResult;
			}
		});
	}
});
