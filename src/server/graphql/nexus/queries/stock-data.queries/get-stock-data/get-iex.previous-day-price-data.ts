import { IexPreviousDayPriceSuffixToPropMap, Prefixes } from "@/server/data-keys";
import { GetStockDataOperation } from ".";
import { getDataForTicker } from "./_get-data-for-ticker.util";

export const getIexPreviousDayPriceData: GetStockDataOperation = (
	{ ticker, suffixes },
	{ dataSources: { IexAPI } }
): Promise<Record<string, any>> => {
	return getDataForTicker(
		{ ticker, suffixes },
		IexAPI.getPreviousDayPrice,
		IexPreviousDayPriceSuffixToPropMap,
		Prefixes.IEX_PREVIOUS_DAY_PRICE
	);
};
