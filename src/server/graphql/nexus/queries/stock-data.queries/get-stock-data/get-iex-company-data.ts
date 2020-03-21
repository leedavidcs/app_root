import { IexCompanySuffixToPropMap, Prefixes } from "@/server/data-keys";
import { GetStockDataOperation } from ".";
import { getDataForTicker } from "./_get-data-for-ticker.util";

export const getIexCompanyData: GetStockDataOperation = (
	{ ticker, suffixes },
	{ dataSources: { IexAPI } }
): Promise<Record<string, any>> => {
	return getDataForTicker(
		{ ticker, suffixes },
		IexAPI.getCompany,
		IexCompanySuffixToPropMap,
		Prefixes.IEX_COMPANY
	);
};
