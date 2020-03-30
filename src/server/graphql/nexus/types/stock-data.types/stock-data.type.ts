import { IexType } from "@/server/datasources";
import { BadInputError, Logger } from "@/server/utils";
import { camelCase, get } from "lodash";
import { objectType } from "nexus";

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

export const StockData = objectType({
	name: "StockData",
	definition: (t) => {
		t.list.string("tickers", { nullable: false });
		t.list.string("dataKeys", { nullable: false });
		t.list.field("data", {
			type: "JSONObject",
			resolve: async ({ tickers, dataKeys }, arg, { dataSources }) => {
				const { IexCloudAPI } = dataSources;

				const types = getTypesFromDataKeys(dataKeys);

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
