import { IServerContextWithUser } from "@/server/graphql/context";
import { getStockData } from "@/server/graphql/nexus/queries/stock-data.queries/get-stock-data";
import { DataKeys } from "@/server/data-keys";

export const getStockPortfolioData = async (stockPortfolio, context: IServerContextWithUser): Promise<Record<string, any>[]> => {
	const { headers = [], tickers } = stockPortfolio;

	const dataKeys: readonly (keyof typeof DataKeys)[] = headers
		.map(({ dataKey }) => dataKey)
		.filter((dataKey) => !dataKey);

	const result: Record<string, any>[] = await Promise.all(
		(tickers as string[]).map((ticker) => getStockData({ ticker, dataKeys }, context))
	);

	return result;
};
