import { objectType } from "@nexus/schema";

export const StockPortfolioHeader = objectType({
	name: "StockPortfolioHeader",
	definition: (t) => {
		t.implements("StockPortfolioDataHeader");
		t.boolean("frozen", { nullable: false });
		t.boolean("resizable", { nullable: false });
		t.int("width", { nullable: false });
	}
});

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

				const parsedHeaders = (stockPortfolio?.headers || []).map((header) =>
					JSON.parse(header)
				);

				return parsedHeaders;
			}
		});
		t.model.tickers();
		t.model.settings();
		t.field("stockData", {
			type: "StockData",
			nullable: false,
			description: "The data that gets resolved based on headers and tickers",
			resolve: async ({ id, tickers }, args, { prisma }) => {
				const stockPortfolio = await prisma.stockPortfolio.findOne({ where: { id } });

				const parsedHeaders = (stockPortfolio?.headers || []).map((header) =>
					JSON.parse(header)
				);
				const dataKeys: string[] = parsedHeaders.map(({ dataKey }) => dataKey);

				return { dataKeys, stockPortfolioId: id, tickers };
			}
		});
		t.list.field("snapshots", {
			type: "Snapshot",
			nullable: false,
			resolve: async ({ id }, args, { prisma }) => {
				const snapshots = await prisma.snapshot.findMany({
					where: { stockPortfolioId: id }
				});

				return snapshots;
			}
		});
		t.model.createdAt();
		t.model.updatedAt();
	}
});
