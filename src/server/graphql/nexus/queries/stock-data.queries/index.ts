import { queryField, stringArg } from "nexus";
import { getStockData } from "./get-stock-data";

export const stockData = queryField("stockData", {
	type: "JSONObject",
	list: true,
	args: {
		tickers: stringArg({ list: true, nullable: false }),
		dataKeys: stringArg({ list: true, nullable: false })
	},
	resolve: (parent, { tickers, dataKeys }, context) => {
		const result = Promise.all(
			tickers.map((ticker) => getStockData({ ticker, dataKeys }, context))
		);

		return result;
	}
});
