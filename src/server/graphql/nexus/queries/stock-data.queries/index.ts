import { queryField, stringArg } from "nexus";

export const stockData = queryField("stockData", {
	type: "StockData",
	args: {
		tickers: stringArg({ list: true, nullable: false }),
		dataKeys: stringArg({ list: true, nullable: false })
	},
	resolve: (parent, { tickers, dataKeys }) => ({ tickers, dataKeys })
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
