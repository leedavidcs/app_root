import { IexQuoteSuffixToPropMap, Prefixes } from "@/server/data-keys";
import { GetStockDataOperation } from ".";
import { getDataForTicker } from "./_get-data-for-ticker.util";

export const getIexQuoteData: GetStockDataOperation = (
	{ ticker, suffixes },
	{ dataSources: { IexAPI } }
): Promise<Record<string, any>> => {
	return getDataForTicker(
		{ ticker, suffixes },
		IexAPI.getQuote,
		IexQuoteSuffixToPropMap,
		Prefixes.IEX_QUOTE
	);
};
