import { objectType } from "nexus";
import { camelCase, get } from "lodash";
import { BadInputError } from "@/server/utils";

export const StockData = objectType({
	name: "StockData",
	definition: (t) => {
		t.list.string("tickers", { nullable: false });
		t.list.string("dataKeys", { nullable: false });
		t.list.field("data", {
			type: "JSONObject",
			resolve: async ({ tickers, dataKeys }, arg, { dataSources }) => {
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

				const stockDataResult: Record<string, any>[] = Object.keys(results).map((ticker) => {
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
			}
		});
	}
});
