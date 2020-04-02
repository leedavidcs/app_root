import { StockDataFeatures } from "@/server/configs";
import { IexType } from "@/server/datasources";
import { IServerContextWithUser } from "@/server/graphql/context";
import { AuthorizationError, BadInputError, Logger, UnexpectedError } from "@/server/utils";
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
	if (!user) {
		throw new AuthorizationError("You must be logged in to request this data.");
	}

	const balance = await prisma.balance.findOne({ where: { userId: user?.id } });

	if (!balance) {
		throw new UnexpectedError();
	}

	if (balance.credits < cost) {
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

export const StockData = objectType({
	name: "StockData",
	definition: (t) => {
		t.list.string("tickers", { nullable: false });
		t.list.string("dataKeys", { nullable: false });
		t.list.field("data", {
			type: "JSONObject",
			resolve: async ({ tickers, dataKeys }, arg, context) => {
				const { dataSources } = context;
				const { IexCloudAPI } = dataSources;

				const types = getTypesFromDataKeys(dataKeys);

				const cost: number = computeCosts(tickers, dataKeys);

				if (cost > 0) {
					await makeTransaction(cost, context);
				}

				let results: Record<string, Record<string, any>>;
				try {
					results = await IexCloudAPI.symbols(tickers, types);
				} catch (err) {
					const message: string = err instanceof Error ? err.message : err;

					Logger.error(message);

					throw new BadInputError("Could not get data. Inputs may be invalid");
				}

				const stockDataResult: Record<string, any>[] = tickers.map((ticker) => {
					return { ticker, ...limitResultToDataKeys(results[ticker], dataKeys) };
				});

				return stockDataResult;
			}
		});
	}
});
