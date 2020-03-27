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
