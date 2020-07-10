import { rql } from "@/scripts/generate-symbols-schema.script/rest-ql";

/**
 * @note insiderRoster, insiderSummary, insiderTransaction, and institutionalOwnership are excluded
 *     due to not working with batch.
 * @author David Lee
 * @date June 14, 2020
 */

export const balanceSheet = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "balanceSheet",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const book = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "book",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const cashFlow = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "cashFlow",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const ceoCompensation = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "ceoCompensation",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const chart = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "chart",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const delayedQuote = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "delayedQuote",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const dividends = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "dividends",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const earnings = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "earnings",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const estimates = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "estimates",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const financials = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "financials",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const fundOwnership = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "fundOwnership",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const income = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "income",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const intradayPrices = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "intradayPrices",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const largestTrades = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "largestTrades",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const logo = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "logo",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const news = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "news",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const ohlc = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "ohlc",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const options = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "options",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const peers = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "peers",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const previous = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "previous",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const price = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "price",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const priceTarget = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "priceTarget",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const quote = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "quote",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const recommendationTrends = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "recommendationTrends",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const sentiment = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "sentiment",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const splits = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "splits",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const stats = rql.resolverField<any, any, any>({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "stats",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});

export const volumeByVenue = rql.resolverField({
	fn: ({ context, isMock: mock, groupByArgs }) => {
		const { IexCloudAPIv2 } = context.dataSources;
		const { symbol } = groupByArgs;

		return IexCloudAPIv2.symbol.load({
			field: "volumeByVenue",
			symbol,
			options: { mock }
		});
	},
	meta: {
		credits: 1
	}
});
