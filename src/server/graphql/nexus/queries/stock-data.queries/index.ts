import { queryField, stringArg } from "nexus";
import { getStockData } from "./get-stock-data";

export const stockData = queryField("stockData", {
	type: "JSONObject",
	list: true,
	args: {
		tickers: stringArg({ list: true, nullable: false }),
		dataKeys: stringArg({ list: true, nullable: false })
	},
	resolve: (parent, args, context) => getStockData(args, context)
});

export const stockSymbols = queryField("stockSymbols", {
	type: "StockDataSearch",
	list: true,
	nullable: false,
	args: {
		text: stringArg({ nullable: false })
	},
	resolve: (parent, { text }, { dataSources }) => {
		if (!text) {
			return [];
		}

		const { IexCloudAPI } = dataSources;

		return IexCloudAPI.search(text);
	}
});
