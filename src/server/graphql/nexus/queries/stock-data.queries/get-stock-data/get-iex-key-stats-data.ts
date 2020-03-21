import { IexKeyStatsSuffixToPropMap, Prefixes } from "@/server/data-keys";
import { GetStockDataOperation } from ".";
import { getDataForTicker } from "./_get-data-for-ticker.util";

export const getIexKeyStatsData: GetStockDataOperation = (
	{ ticker, suffixes },
	{ dataSources: { IexAPI } }
): Promise<Record<string, any>> => {
	return getDataForTicker(
		{ ticker, suffixes },
		IexAPI.getKeyStats,
		IexKeyStatsSuffixToPropMap,
		Prefixes.IEX_KEY_STATS
	);
};
