import { queryField, stringArg } from "@nexus/schema";

export const stockData = queryField("stockData", {
	type: "StockData",
	args: {
		tickers: stringArg({ list: true, nullable: false }),
		dataKeys: stringArg({ list: true, nullable: false })
	},
	rateLimit: () => ({ window: "1m", max: 30 }),
	resolve: (parent, { tickers, dataKeys }) => ({ tickers, dataKeys })
});

export const stockSymbols = queryField("stockSymbols", {
	type: "StockDataSearch",
	list: true,
	nullable: false,
	args: {
		text: stringArg({ nullable: false })
	},
	rateLimit: () => ({ window: "1s", max: 30 }),
	resolve: (parent, { text }, { dataSources }) => {
		const { IexCloudAPI } = dataSources;

		if (!text) {
			return [];
		}

		return IexCloudAPI.search(text);
	}
});
