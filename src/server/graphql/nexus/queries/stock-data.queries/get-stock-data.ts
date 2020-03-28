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
		.map((dataKey) => camelCase(dataKey.split(".")[0]))
		.reduce((acc, key) => ({ ...acc, [key]: true }), {});

	let results: Record<string, Record<string, any>>;

	try {
		results = await IexCloudAPI.symbols(tickers, types);
	} catch (err) {
		const message: string = err instanceof Error ? err.message : err;

		throw new BadInputError(message);
	}

	const stockDataResult = Object.keys(results).map((ticker) => {
		const limitedToDataKeys = dataKeys.reduce<Record<string, any>>(
			(acc, dataKey) => ({
				...acc,
				[dataKey]: get(results[ticker], dataKey)
			}),
			{}
		);

		return { ticker, ...limitedToDataKeys };
	});

	return stockDataResult;
};
