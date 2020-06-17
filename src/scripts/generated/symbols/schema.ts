import { arg, inputObjectType, makeSchema, objectType, queryType, scalarType } from "@nexus/schema";
import { ValueNode } from "graphql";
import path from "path";

const dirname: string = path.join(process.env.PROJECT_DIRNAME ?? "", "src/scripts/generated");

const getPath = (fileName: string): string => path.join(dirname, fileName);

const types = {} as Record<string, any>;

/**
 * @description Assume this value is either a GraphQL Int or Float. Type will not check to
 * prevent runtime errors, and this type will not differentiate between the two, for
 * flexability wrt type generation.
 */
types.Number = scalarType({
	name: "Number",
	serialize: (value: number) => value,
	parseValue: (value: number) => value,
	parseLiteral: (ast: ValueNode) => (ast as any).value ?? undefined
});

types.RequestArgs = inputObjectType<any>({
	name: "RequestArgs",
	description: "",
	definition: (t) => {
		t.list.field("symbols", {
			type: "String" as any,
			nullable: true
		});
	}
});

types.IexCloudBookQuote = objectType<any>({
	name: "IexCloudBookQuote",
	description: "",
	definition: (t) => {
		t.field("symbol", {
			type: "String" as any,
			nullable: true
		});
		t.field("companyName", {
			type: "String" as any,
			nullable: true
		});
		t.field("primaryExchange", {
			type: "String" as any,
			nullable: true
		});
		t.field("calculationPrice", {
			type: "String" as any,
			nullable: true
		});
		t.field("open", {
			type: "Number" as any,
			nullable: true
		});
		t.field("openTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("openSource", {
			type: "String" as any,
			nullable: true
		});
		t.field("close", {
			type: "Number" as any,
			nullable: true
		});
		t.field("closeTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("closeSource", {
			type: "String" as any,
			nullable: true
		});
		t.field("high", {
			type: "Number" as any,
			nullable: true
		});
		t.field("highTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("highSource", {
			type: "String" as any,
			nullable: true
		});
		t.field("low", {
			type: "Number" as any,
			nullable: true
		});
		t.field("lowTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("lowSource", {
			type: "String" as any,
			nullable: true
		});
		t.field("latestPrice", {
			type: "Number" as any,
			nullable: true
		});
		t.field("latestSource", {
			type: "String" as any,
			nullable: true
		});
		t.field("latestTime", {
			type: "String" as any,
			nullable: true
		});
		t.field("latestUpdate", {
			type: "Number" as any,
			nullable: true
		});
		t.field("latestVolume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexRealtimePrice", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexRealtimeSize", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexLastUpdated", {
			type: "Number" as any,
			nullable: true
		});
		t.field("delayedPrice", {
			type: "Number" as any,
			nullable: true
		});
		t.field("delayedPriceTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("oddLotDelayedPrice", {
			type: "Number" as any,
			nullable: true
		});
		t.field("oddLotDelayedPriceTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("extendedPrice", {
			type: "Number" as any,
			nullable: true
		});
		t.field("extendedChange", {
			type: "Number" as any,
			nullable: true
		});
		t.field("extendedChangePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("extendedPriceTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("previousClose", {
			type: "Number" as any,
			nullable: true
		});
		t.field("previousVolume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("change", {
			type: "Number" as any,
			nullable: true
		});
		t.field("changePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("volume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexMarketPercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexVolume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("avgTotalVolume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexBidPrice", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexBidSize", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexAskPrice", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexAskSize", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexClose", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexCloseTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("marketCap", {
			type: "Number" as any,
			nullable: true
		});
		t.field("peRatio", {
			type: "Number" as any,
			nullable: true
		});
		t.field("week52High", {
			type: "Number" as any,
			nullable: true
		});
		t.field("week52Low", {
			type: "Number" as any,
			nullable: true
		});
		t.field("ytdChange", {
			type: "Number" as any,
			nullable: true
		});
		t.field("lastTradeTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("isUSMarketOpen", {
			type: "Boolean" as any,
			nullable: true
		});
	}
});

types.IexCloudBookTrades = objectType<any>({
	name: "IexCloudBookTrades",
	description: "",
	definition: (t) => {
		t.field("price", {
			type: "Number" as any,
			nullable: true
		});
		t.field("size", {
			type: "Number" as any,
			nullable: true
		});
		t.field("tradeId", {
			type: "Number" as any,
			nullable: true
		});
		t.field("isISO", {
			type: "Boolean" as any,
			nullable: true
		});
		t.field("isOddLot", {
			type: "Boolean" as any,
			nullable: true
		});
		t.field("isOutsideRegularHours", {
			type: "Boolean" as any,
			nullable: true
		});
		t.field("isSinglePriceCross", {
			type: "Boolean" as any,
			nullable: true
		});
		t.field("isTradeThroughExempt", {
			type: "Boolean" as any,
			nullable: true
		});
		t.field("timestamp", {
			type: "Number" as any,
			nullable: true
		});
	}
});

types.IexCloudBookSystemEvent = objectType<any>({
	name: "IexCloudBookSystemEvent",
	description: "",
	definition: (t) => {
		t.field("systemEvent", {
			type: "String" as any,
			nullable: true
		});
		t.field("timestamp", {
			type: "Number" as any,
			nullable: true
		});
	}
});

types.IexCloudBook = objectType<any>({
	name: "IexCloudBook",
	description: "",
	definition: (t) => {
		t.field("quote", {
			type: "IexCloudBookQuote" as any,
			nullable: true
		});
		t.list.field("trades", {
			type: "IexCloudBookTrades" as any,
			nullable: true
		});
		t.field("systemEvent", {
			type: "IexCloudBookSystemEvent" as any,
			nullable: true
		});
	}
});

types.IexCloudChart = objectType<any>({
	name: "IexCloudChart",
	description: "",
	definition: (t) => {
		t.field("date", {
			type: "String" as any,
			nullable: true
		});
		t.field("open", {
			type: "Number" as any,
			nullable: true
		});
		t.field("close", {
			type: "Number" as any,
			nullable: true
		});
		t.field("high", {
			type: "Number" as any,
			nullable: true
		});
		t.field("low", {
			type: "Number" as any,
			nullable: true
		});
		t.field("volume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("uOpen", {
			type: "Number" as any,
			nullable: true
		});
		t.field("uClose", {
			type: "Number" as any,
			nullable: true
		});
		t.field("uHigh", {
			type: "Number" as any,
			nullable: true
		});
		t.field("uLow", {
			type: "Number" as any,
			nullable: true
		});
		t.field("uVolume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("change", {
			type: "Number" as any,
			nullable: true
		});
		t.field("changePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("label", {
			type: "String" as any,
			nullable: true
		});
		t.field("changeOverTime", {
			type: "Number" as any,
			nullable: true
		});
	}
});

types.IexCloudEarningsEarnings = objectType<any>({
	name: "IexCloudEarningsEarnings",
	description: "",
	definition: (t) => {
		t.field("actualEPS", {
			type: "Number" as any,
			nullable: true
		});
		t.field("consensusEPS", {
			type: "Number" as any,
			nullable: true
		});
		t.field("announceTime", {
			type: "String" as any,
			nullable: true
		});
		t.field("numberOfEstimates", {
			type: "Number" as any,
			nullable: true
		});
		t.field("EPSSurpriseDollar", {
			type: "Number" as any,
			nullable: true
		});
		t.field("EPSReportDate", {
			type: "String" as any,
			nullable: true
		});
		t.field("fiscalPeriod", {
			type: "String" as any,
			nullable: true
		});
		t.field("fiscalEndDate", {
			type: "String" as any,
			nullable: true
		});
		t.field("yearAgo", {
			type: "Number" as any,
			nullable: true
		});
		t.field("yearAgoChangePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("currency", {
			type: "String" as any,
			nullable: true
		});
	}
});

types.IexCloudEarnings = objectType<any>({
	name: "IexCloudEarnings",
	description: "",
	definition: (t) => {
		t.field("symbol", {
			type: "String" as any,
			nullable: true
		});
		t.list.field("earnings", {
			type: "IexCloudEarningsEarnings" as any,
			nullable: true
		});
	}
});

types.IexCloudEstimatesEstimates = objectType<any>({
	name: "IexCloudEstimatesEstimates",
	description: "",
	definition: (t) => {
		t.field("consensusEPS", {
			type: "Number" as any,
			nullable: true
		});
		t.field("announceTime", {
			type: "String" as any,
			nullable: true
		});
		t.field("numberOfEstimates", {
			type: "Number" as any,
			nullable: true
		});
		t.field("reportDate", {
			type: "String" as any,
			nullable: true
		});
		t.field("fiscalPeriod", {
			type: "String" as any,
			nullable: true
		});
		t.field("fiscalEndDate", {
			type: "String" as any,
			nullable: true
		});
		t.field("currency", {
			type: "String" as any,
			nullable: true
		});
	}
});

types.IexCloudEstimates = objectType<any>({
	name: "IexCloudEstimates",
	description: "",
	definition: (t) => {
		t.field("symbol", {
			type: "String" as any,
			nullable: true
		});
		t.list.field("estimates", {
			type: "IexCloudEstimatesEstimates" as any,
			nullable: true
		});
	}
});

types.IexCloudFinancialsFinancials = objectType<any>({
	name: "IexCloudFinancialsFinancials",
	description: "",
	definition: (t) => {
		t.field("reportDate", {
			type: "String" as any,
			nullable: true
		});
		t.field("fiscalDate", {
			type: "String" as any,
			nullable: true
		});
		t.field("currency", {
			type: "String" as any,
			nullable: true
		});
		t.field("grossProfit", {
			type: "Number" as any,
			nullable: true
		});
		t.field("costOfRevenue", {
			type: "Number" as any,
			nullable: true
		});
		t.field("operatingRevenue", {
			type: "Number" as any,
			nullable: true
		});
		t.field("totalRevenue", {
			type: "Number" as any,
			nullable: true
		});
		t.field("operatingIncome", {
			type: "Number" as any,
			nullable: true
		});
		t.field("netIncome", {
			type: "Number" as any,
			nullable: true
		});
		t.field("researchAndDevelopment", {
			type: "Number" as any,
			nullable: true
		});
		t.field("operatingExpense", {
			type: "Number" as any,
			nullable: true
		});
		t.field("currentAssets", {
			type: "Number" as any,
			nullable: true
		});
		t.field("totalAssets", {
			type: "Number" as any,
			nullable: true
		});
		t.field("totalLiabilities", {
			type: "Number" as any,
			nullable: true
		});
		t.field("currentCash", {
			type: "Number" as any,
			nullable: true
		});
		t.field("currentDebt", {
			type: "Number" as any,
			nullable: true
		});
		t.field("shortTermDebt", {
			type: "Number" as any,
			nullable: true
		});
		t.field("longTermDebt", {
			type: "Number" as any,
			nullable: true
		});
		t.field("totalCash", {
			type: "Number" as any,
			nullable: true
		});
		t.field("totalDebt", {
			type: "Number" as any,
			nullable: true
		});
		t.field("shareholderEquity", {
			type: "Number" as any,
			nullable: true
		});
		t.field("cashChange", {
			type: "Number" as any,
			nullable: true
		});
		t.field("cashFlow", {
			type: "Number" as any,
			nullable: true
		});
	}
});

types.IexCloudFinancials = objectType<any>({
	name: "IexCloudFinancials",
	description: "",
	definition: (t) => {
		t.field("symbol", {
			type: "String" as any,
			nullable: true
		});
		t.list.field("financials", {
			type: "IexCloudFinancialsFinancials" as any,
			nullable: true
		});
	}
});

types.IexCloudIncomeIncome = objectType<any>({
	name: "IexCloudIncomeIncome",
	description: "",
	definition: (t) => {
		t.field("reportDate", {
			type: "String" as any,
			nullable: true
		});
		t.field("fiscalDate", {
			type: "String" as any,
			nullable: true
		});
		t.field("currency", {
			type: "String" as any,
			nullable: true
		});
		t.field("totalRevenue", {
			type: "Number" as any,
			nullable: true
		});
		t.field("costOfRevenue", {
			type: "Number" as any,
			nullable: true
		});
		t.field("grossProfit", {
			type: "Number" as any,
			nullable: true
		});
		t.field("researchAndDevelopment", {
			type: "Number" as any,
			nullable: true
		});
		t.field("sellingGeneralAndAdmin", {
			type: "Number" as any,
			nullable: true
		});
		t.field("operatingExpense", {
			type: "Number" as any,
			nullable: true
		});
		t.field("operatingIncome", {
			type: "Number" as any,
			nullable: true
		});
		t.field("otherIncomeExpenseNet", {
			type: "Number" as any,
			nullable: true
		});
		t.field("ebit", {
			type: "Number" as any,
			nullable: true
		});
		t.field("interestIncome", {
			type: "Number" as any,
			nullable: true
		});
		t.field("pretaxIncome", {
			type: "Number" as any,
			nullable: true
		});
		t.field("incomeTax", {
			type: "Number" as any,
			nullable: true
		});
		t.field("minorityInterest", {
			type: "Number" as any,
			nullable: true
		});
		t.field("netIncome", {
			type: "Number" as any,
			nullable: true
		});
		t.field("netIncomeBasic", {
			type: "Number" as any,
			nullable: true
		});
	}
});

types.IexCloudIncome = objectType<any>({
	name: "IexCloudIncome",
	description: "",
	definition: (t) => {
		t.field("symbol", {
			type: "String" as any,
			nullable: true
		});
		t.list.field("income", {
			type: "IexCloudIncomeIncome" as any,
			nullable: true
		});
	}
});

types.IexCloudLogo = objectType<any>({
	name: "IexCloudLogo",
	description: "",
	definition: (t) => {
		t.field("url", {
			type: "String" as any,
			nullable: true
		});
	}
});

types.IexCloudNews = objectType<any>({
	name: "IexCloudNews",
	description: "",
	definition: (t) => {
		t.field("datetime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("headline", {
			type: "String" as any,
			nullable: true
		});
		t.field("source", {
			type: "String" as any,
			nullable: true
		});
		t.field("url", {
			type: "String" as any,
			nullable: true
		});
		t.field("summary", {
			type: "String" as any,
			nullable: true
		});
		t.field("related", {
			type: "String" as any,
			nullable: true
		});
		t.field("image", {
			type: "String" as any,
			nullable: true
		});
		t.field("lang", {
			type: "String" as any,
			nullable: true
		});
		t.field("hasPaywall", {
			type: "Boolean" as any,
			nullable: true
		});
	}
});

types.IexCloudOhlcOpen = objectType<any>({
	name: "IexCloudOhlcOpen",
	description: "",
	definition: (t) => {
		t.field("price", {
			type: "Number" as any,
			nullable: true
		});
		t.field("time", {
			type: "Number" as any,
			nullable: true
		});
	}
});

types.IexCloudOhlcClose = objectType<any>({
	name: "IexCloudOhlcClose",
	description: "",
	definition: (t) => {
		t.field("price", {
			type: "Number" as any,
			nullable: true
		});
		t.field("time", {
			type: "Number" as any,
			nullable: true
		});
	}
});

types.IexCloudOhlc = objectType<any>({
	name: "IexCloudOhlc",
	description: "",
	definition: (t) => {
		t.field("open", {
			type: "IexCloudOhlcOpen" as any,
			nullable: true
		});
		t.field("close", {
			type: "IexCloudOhlcClose" as any,
			nullable: true
		});
		t.field("high", {
			type: "Number" as any,
			nullable: true
		});
		t.field("low", {
			type: "Number" as any,
			nullable: true
		});
		t.field("volume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("symbol", {
			type: "String" as any,
			nullable: true
		});
	}
});

types.IexCloudPrevious = objectType<any>({
	name: "IexCloudPrevious",
	description: "",
	definition: (t) => {
		t.field("date", {
			type: "String" as any,
			nullable: true
		});
		t.field("open", {
			type: "Number" as any,
			nullable: true
		});
		t.field("close", {
			type: "Number" as any,
			nullable: true
		});
		t.field("high", {
			type: "Number" as any,
			nullable: true
		});
		t.field("low", {
			type: "Number" as any,
			nullable: true
		});
		t.field("volume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("uOpen", {
			type: "Number" as any,
			nullable: true
		});
		t.field("uClose", {
			type: "Number" as any,
			nullable: true
		});
		t.field("uHigh", {
			type: "Number" as any,
			nullable: true
		});
		t.field("uLow", {
			type: "Number" as any,
			nullable: true
		});
		t.field("uVolume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("change", {
			type: "Number" as any,
			nullable: true
		});
		t.field("changePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("changeOverTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("symbol", {
			type: "String" as any,
			nullable: true
		});
	}
});

types.IexCloudPrevious = objectType<any>({
	name: "IexCloudPrevious",
	description: "",
	definition: (t) => {
		t.field("date", {
			type: "String" as any,
			nullable: true
		});
		t.field("open", {
			type: "Number" as any,
			nullable: true
		});
		t.field("close", {
			type: "Number" as any,
			nullable: true
		});
		t.field("high", {
			type: "Number" as any,
			nullable: true
		});
		t.field("low", {
			type: "Number" as any,
			nullable: true
		});
		t.field("volume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("uOpen", {
			type: "Number" as any,
			nullable: true
		});
		t.field("uClose", {
			type: "Number" as any,
			nullable: true
		});
		t.field("uHigh", {
			type: "Number" as any,
			nullable: true
		});
		t.field("uLow", {
			type: "Number" as any,
			nullable: true
		});
		t.field("uVolume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("change", {
			type: "Number" as any,
			nullable: true
		});
		t.field("changePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("changeOverTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("symbol", {
			type: "String" as any,
			nullable: true
		});
	}
});

types.IexCloudQuote = objectType<any>({
	name: "IexCloudQuote",
	description: "",
	definition: (t) => {
		t.field("symbol", {
			type: "String" as any,
			nullable: true
		});
		t.field("companyName", {
			type: "String" as any,
			nullable: true
		});
		t.field("primaryExchange", {
			type: "String" as any,
			nullable: true
		});
		t.field("calculationPrice", {
			type: "String" as any,
			nullable: true
		});
		t.field("open", {
			type: "Number" as any,
			nullable: true
		});
		t.field("openTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("openSource", {
			type: "String" as any,
			nullable: true
		});
		t.field("close", {
			type: "Number" as any,
			nullable: true
		});
		t.field("closeTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("closeSource", {
			type: "String" as any,
			nullable: true
		});
		t.field("high", {
			type: "Number" as any,
			nullable: true
		});
		t.field("highTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("highSource", {
			type: "String" as any,
			nullable: true
		});
		t.field("low", {
			type: "Number" as any,
			nullable: true
		});
		t.field("lowTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("lowSource", {
			type: "String" as any,
			nullable: true
		});
		t.field("latestPrice", {
			type: "Number" as any,
			nullable: true
		});
		t.field("latestSource", {
			type: "String" as any,
			nullable: true
		});
		t.field("latestTime", {
			type: "String" as any,
			nullable: true
		});
		t.field("latestUpdate", {
			type: "Number" as any,
			nullable: true
		});
		t.field("latestVolume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexRealtimePrice", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexRealtimeSize", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexLastUpdated", {
			type: "Number" as any,
			nullable: true
		});
		t.field("delayedPrice", {
			type: "Number" as any,
			nullable: true
		});
		t.field("delayedPriceTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("oddLotDelayedPrice", {
			type: "Number" as any,
			nullable: true
		});
		t.field("oddLotDelayedPriceTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("extendedPrice", {
			type: "Number" as any,
			nullable: true
		});
		t.field("extendedChange", {
			type: "Number" as any,
			nullable: true
		});
		t.field("extendedChangePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("extendedPriceTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("previousClose", {
			type: "Number" as any,
			nullable: true
		});
		t.field("previousVolume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("change", {
			type: "Number" as any,
			nullable: true
		});
		t.field("changePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("volume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexMarketPercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexVolume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("avgTotalVolume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexBidPrice", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexBidSize", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexAskPrice", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexAskSize", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexClose", {
			type: "Number" as any,
			nullable: true
		});
		t.field("iexCloseTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("marketCap", {
			type: "Number" as any,
			nullable: true
		});
		t.field("peRatio", {
			type: "Number" as any,
			nullable: true
		});
		t.field("week52High", {
			type: "Number" as any,
			nullable: true
		});
		t.field("week52Low", {
			type: "Number" as any,
			nullable: true
		});
		t.field("ytdChange", {
			type: "Number" as any,
			nullable: true
		});
		t.field("lastTradeTime", {
			type: "Number" as any,
			nullable: true
		});
		t.field("isUSMarketOpen", {
			type: "Boolean" as any,
			nullable: true
		});
	}
});

types.IexCloudStats = objectType<any>({
	name: "IexCloudStats",
	description: "",
	definition: (t) => {
		t.field("week52change", {
			type: "Number" as any,
			nullable: true
		});
		t.field("week52high", {
			type: "Number" as any,
			nullable: true
		});
		t.field("week52low", {
			type: "Number" as any,
			nullable: true
		});
		t.field("marketcap", {
			type: "Number" as any,
			nullable: true
		});
		t.field("employees", {
			type: "Number" as any,
			nullable: true
		});
		t.field("day200MovingAvg", {
			type: "Number" as any,
			nullable: true
		});
		t.field("day50MovingAvg", {
			type: "Number" as any,
			nullable: true
		});
		t.field("float", {
			type: "Number" as any,
			nullable: true
		});
		t.field("avg10Volume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("avg30Volume", {
			type: "Number" as any,
			nullable: true
		});
		t.field("ttmEPS", {
			type: "Number" as any,
			nullable: true
		});
		t.field("companyName", {
			type: "String" as any,
			nullable: true
		});
		t.field("sharesOutstanding", {
			type: "Number" as any,
			nullable: true
		});
		t.field("maxChangePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("year5ChangePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("year2ChangePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("year1ChangePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("ytdChangePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("month6ChangePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("month3ChangePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("month1ChangePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("day30ChangePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("day5ChangePercent", {
			type: "Number" as any,
			nullable: true
		});
		t.field("nextEarningsDate", {
			type: "String" as any,
			nullable: true
		});
		t.field("peRatio", {
			type: "Number" as any,
			nullable: true
		});
		t.field("beta", {
			type: "Number" as any,
			nullable: true
		});
	}
});

types.IexCloudProvider = objectType<any>({
	name: "IexCloudProvider",
	description: "Market data, provided by [IEX Cloud](https://iexcloud.io/)",
	definition: (t) => {
		t.field("book", {
			type: "IexCloudBook" as any,
			nullable: true,
			description: "",
			resolve: async (parent, args = {}, context) => {
				const result = await (context as any).client.query({
					provider: "iexCloud",
					requestArgs: (parent as any).requestArgs,
					groupByArgs: (parent as any).groupByArgs,
					fields: {
						book: { args }
					}
				});

				return result.book;
			}
		});
		t.list.field("chart", {
			type: "IexCloudChart" as any,
			nullable: true,
			description: "",
			resolve: async (parent, args = {}, context) => {
				const result = await (context as any).client.query({
					provider: "iexCloud",
					requestArgs: (parent as any).requestArgs,
					groupByArgs: (parent as any).groupByArgs,
					fields: {
						chart: { args }
					}
				});

				return result.chart;
			}
		});
		t.field("earnings", {
			type: "IexCloudEarnings" as any,
			nullable: true,
			description: "",
			resolve: async (parent, args = {}, context) => {
				const result = await (context as any).client.query({
					provider: "iexCloud",
					requestArgs: (parent as any).requestArgs,
					groupByArgs: (parent as any).groupByArgs,
					fields: {
						earnings: { args }
					}
				});

				return result.earnings;
			}
		});
		t.field("estimates", {
			type: "IexCloudEstimates" as any,
			nullable: true,
			description: "",
			resolve: async (parent, args = {}, context) => {
				const result = await (context as any).client.query({
					provider: "iexCloud",
					requestArgs: (parent as any).requestArgs,
					groupByArgs: (parent as any).groupByArgs,
					fields: {
						estimates: { args }
					}
				});

				return result.estimates;
			}
		});
		t.field("financials", {
			type: "IexCloudFinancials" as any,
			nullable: true,
			description: "",
			resolve: async (parent, args = {}, context) => {
				const result = await (context as any).client.query({
					provider: "iexCloud",
					requestArgs: (parent as any).requestArgs,
					groupByArgs: (parent as any).groupByArgs,
					fields: {
						financials: { args }
					}
				});

				return result.financials;
			}
		});
		t.field("income", {
			type: "IexCloudIncome" as any,
			nullable: true,
			description: "",
			resolve: async (parent, args = {}, context) => {
				const result = await (context as any).client.query({
					provider: "iexCloud",
					requestArgs: (parent as any).requestArgs,
					groupByArgs: (parent as any).groupByArgs,
					fields: {
						income: { args }
					}
				});

				return result.income;
			}
		});
		t.field("logo", {
			type: "IexCloudLogo" as any,
			nullable: true,
			description: "",
			resolve: async (parent, args = {}, context) => {
				const result = await (context as any).client.query({
					provider: "iexCloud",
					requestArgs: (parent as any).requestArgs,
					groupByArgs: (parent as any).groupByArgs,
					fields: {
						logo: { args }
					}
				});

				return result.logo;
			}
		});
		t.list.field("news", {
			type: "IexCloudNews" as any,
			nullable: true,
			description: "",
			resolve: async (parent, args = {}, context) => {
				const result = await (context as any).client.query({
					provider: "iexCloud",
					requestArgs: (parent as any).requestArgs,
					groupByArgs: (parent as any).groupByArgs,
					fields: {
						news: { args }
					}
				});

				return result.news;
			}
		});
		t.field("ohlc", {
			type: "IexCloudOhlc" as any,
			nullable: true,
			description: "",
			resolve: async (parent, args = {}, context) => {
				const result = await (context as any).client.query({
					provider: "iexCloud",
					requestArgs: (parent as any).requestArgs,
					groupByArgs: (parent as any).groupByArgs,
					fields: {
						ohlc: { args }
					}
				});

				return result.ohlc;
			}
		});
		t.list.field("peers", {
			type: "String" as any,
			nullable: true,
			description: "",
			resolve: async (parent, args = {}, context) => {
				const result = await (context as any).client.query({
					provider: "iexCloud",
					requestArgs: (parent as any).requestArgs,
					groupByArgs: (parent as any).groupByArgs,
					fields: {
						peers: { args }
					}
				});

				return result.peers;
			}
		});
		t.field("previous", {
			type: "IexCloudPrevious" as any,
			nullable: true,
			description: "",
			resolve: async (parent, args = {}, context) => {
				const result = await (context as any).client.query({
					provider: "iexCloud",
					requestArgs: (parent as any).requestArgs,
					groupByArgs: (parent as any).groupByArgs,
					fields: {
						previous: { args }
					}
				});

				return result.previous;
			}
		});
		t.field("price", {
			type: "Number" as any,
			nullable: true,
			description: "",
			resolve: async (parent, args = {}, context) => {
				const result = await (context as any).client.query({
					provider: "iexCloud",
					requestArgs: (parent as any).requestArgs,
					groupByArgs: (parent as any).groupByArgs,
					fields: {
						price: { args }
					}
				});

				return result.price;
			}
		});
		t.field("quote", {
			type: "IexCloudQuote" as any,
			nullable: true,
			description: "",
			resolve: async (parent, args = {}, context) => {
				const result = await (context as any).client.query({
					provider: "iexCloud",
					requestArgs: (parent as any).requestArgs,
					groupByArgs: (parent as any).groupByArgs,
					fields: {
						quote: { args }
					}
				});

				return result.quote;
			}
		});
		t.field("stats", {
			type: "IexCloudStats" as any,
			nullable: true,
			description: "",
			resolve: async (parent, args = {}, context) => {
				const result = await (context as any).client.query({
					provider: "iexCloud",
					requestArgs: (parent as any).requestArgs,
					groupByArgs: (parent as any).groupByArgs,
					fields: {
						stats: { args }
					}
				});

				return result.stats;
			}
		});
	}
});

types.Providers = objectType<any>({
	name: "Providers",
	definition: (t) => {
		t.field("iexCloud", {
			type: "IexCloudProvider" as any,
			nullable: false,
			description: "Market data, provided by [IEX Cloud](https://iexcloud.io/)",
			resolve: ({ requestArgs, groupByArgs }) => ({
				requestArgs,
				groupByArgs
			})
		});
	}
});

types.Data = objectType<any>({
	name: "Data",
	definition: (t) => {
		t.field("symbol", {
			type: "String",
			nullable: false,
			resolve: ({ groupByArgs }) => (groupByArgs as any)?.symbol
		});
		t.field("providers", {
			type: "Providers" as any,
			nullable: false,
			resolve: ({ requestArgs, groupByArgs }) => ({
				requestArgs,
				groupByArgs
			})
		});
	}
});

types.Query = queryType({
	description: "Root query type",
	definition: (t) => {
		t.boolean("ok", { resolve: () => true });
		t.list.field("data", {
			type: "Data" as any,
			nullable: false,
			args: {
				requestArgs: arg({
					type: "RequestArgs" as any,
					nullable: false,
					description: ""
				})
			},
			resolve: (parent, { requestArgs }) => {
				const { symbols } = requestArgs;
				const groupByArgsPairs = [["symbols", "symbol"]];
				const cartesian = <T = any>(...arrays: T[][]): T[][] => {
					return arrays.reduce<T[][]>(
						(results, entries) =>
							results
								.map((res) => entries.map((entry) => [...res, entry]))
								.reduce((sub, res) => [...sub, ...res], []),
						[[]]
					);
				};
				const withGroups = cartesian(symbols).map((product) => {
					const groupByArgs = product.reduce((acc, value, i) => {
						const alias = groupByArgsPairs[i][1];
						return { ...acc, [alias]: value };
					}, {} as Record<string, any>);
					return { groupByArgs, requestArgs };
				});
				return withGroups;
			}
		});
	}
});

export const schema = makeSchema({
	nonNullDefaults: {
		input: false,
		output: false
	},
	outputs: {
		schema: getPath("symbols/schema.graphql")
	},
	shouldGenerateArtifacts: true,
	shouldExitAfterGenerateArtifacts: false,
	types
});

