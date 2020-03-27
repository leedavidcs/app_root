import { getStockData } from "@/server/graphql/nexus/queries/stock-data.queries/get-stock-data";
import { objectType } from "nexus";

export const StockPortfolioHeader = objectType({
	name: "StockPortfolioHeader",
	definition: (t) => {
		t.string("name", { nullable: false });
		t.string("dataKey", { nullable: false });
		t.boolean("frozen", { nullable: false });
		t.boolean("resizable", { nullable: false });
		t.int("width", { nullable: false });
	}
})

export const StockPortfolio = objectType({
	name: "StockPortfolio",
	description: "StockPortfolio entity. This is what gets shown on the data grid",
	definition: (t) => {
		t.model.id();
		t.model.user();
		t.model.name();
		t.list.field("headers", {
			type: "StockPortfolioHeader",
			nullable: false,
			resolve: async ({ id }, args, { prisma }) => {
				const stockPortfolio = await prisma.stockPortfolio.findOne({ where: { id } });

				const parsedHeaders = (stockPortfolio?.headers || []).map((header) => JSON.parse(header));

				return parsedHeaders;
			}
		});
		t.model.tickers();
		t.list.field("data", {
			type: "JSONObject",
			nullable: false,
			description: "The data that gets resolved based on headers and tickers",
			resolve: async ({ id, tickers }, args, context) => {
				const { prisma } = context;

				const stockPortfolio = await prisma.stockPortfolio.findOne({ where: { id } });

				const parsedHeaders = (stockPortfolio?.headers || []).map((header) => JSON.parse(header));
				const dataKeys: readonly string[] = parsedHeaders.map(({ dataKey }) => dataKey);

				return getStockData({ dataKeys, tickers }, context);
			}
		});
		t.model.createdAt();
		t.model.updatedAt();
	}
});
