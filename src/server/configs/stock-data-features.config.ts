import { IexType } from "@/server/datasources";

interface IFeatureConfig {
	enabled: boolean;
	cost: number;
}

export const StockDataFeatures: Record<IexType, IFeatureConfig> = {
	balanceSheet: {
		enabled: true,
		cost: 1
	},
	book: {
		enabled: true,
		cost: 1
	},
	cashFlow: {
		enabled: true,
		cost: 1
	},
	ceoCompensation: {
		enabled: true,
		cost: 1
	},
	chart: {
		enabled: false,
		cost: Infinity
	},
	company: {
		enabled: true,
		cost: 1
	},
	delayedQuote: {
		enabled: false,
		cost: Infinity
	},
	dividends: {
		enabled: false,
		cost: Infinity
	},
	earnings: {
		enabled: true,
		cost: 1
	},
	estimates: {
		enabled: true,
		cost: 1
	},
	financials: {
		enabled: true,
		cost: 1
	},
	fundOwnership: {
		enabled: false,
		cost: Infinity
	},
	income: {
		enabled: true,
		cost: 1
	},
	insiderRoster: {
		enabled: false,
		cost: Infinity
	},
	insiderSummary: {
		enabled: false,
		cost: Infinity
	},
	insiderTransactions: {
		enabled: false,
		cost: Infinity
	},
	institutionalOwnership: {
		enabled: false,
		cost: Infinity
	},
	intradayPrices: {
		enabled: true,
		cost: 1
	},
	largestTrades: {
		enabled: true,
		cost: 1
	},
	logo: {
		enabled: true,
		cost: 1
	},
	news: {
		enabled: true,
		cost: 1
	},
	options: {
		enabled: true,
		cost: 1
	},
	peers: {
		enabled: true,
		cost: 1
	},
	previous: {
		enabled: true,
		cost: 1
	},
	price: {
		enabled: true,
		cost: 1
	},
	priceTarget: {
		enabled: true,
		cost: 1
	},
	ohlc: {
		enabled: true,
		cost: 1
	},
	quote: {
		enabled: true,
		cost: 1
	},
	recommendationTrends: {
		enabled: true,
		cost: 1
	},
	sentiment: {
		enabled: true,
		cost: 1
	},
	shortInterest: {
		enabled: false,
		cost: Infinity
	},
	splits: {
		enabled: false,
		cost: Infinity
	},
	stats: {
		enabled: true,
		cost: 1
	},
	volumeByVenue: {
		enabled: true,
		cost: 1
	}
};
