import { IServerContextWithUser } from "@/server/graphql/context";
import { BadInputError } from "@/server/utils";
import { camelCase, get } from "lodash";

interface IGetStockDataInput {
	tickers: readonly string[];
	dataKeys: readonly string[];
}

export const getStockData = async (
	{ tickers, dataKeys }: IGetStockDataInput,
	{ dataSources }: IServerContextWithUser
) => {
	const { IexCloudAPI } = dataSources;

	const types: Record<string, true> = dataKeys
		.map((dataKey) => {
			return camelCase(dataKey.split(".")[0]);
		})
		.reduce((acc, key) => ({ ...acc, [key]: true }), {});

	let results: Record<string, Record<string, any>>;

	try {
		results = await IexCloudAPI.symbols(tickers, types);
	} catch (err) {
		const message: string = err instanceof Error ? err.message : err;

		throw new BadInputError(message);
	}

	const stockDataResult = Object.keys(results).reduce<Record<string, any>[]>((acc, ticker) => {
		const limitedToDataKeys = dataKeys.map((dataKey) => get(results[ticker], dataKey));

		return [...acc, { ticker, ...limitedToDataKeys }];
	}, []);

	return stockDataResult;
};
