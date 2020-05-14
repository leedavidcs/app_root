import { objectType } from "@nexus/schema";

export const StockPortfolioHeader = objectType({
	name: "StockPortfolioHeader",
	definition: (t) => {
		t.string("name", { nullable: false });
		t.string("dataKey");
	}
});

export const StockPortfolio = objectType({
	name: "StockPortfolio",
	definition: (t) => {
		t.model.id();
		t.model.name();
		t.model.tickers();
		t.model.createdAt();
		t.model.updatedAt();
		t.list.field("headers", {
			type: "StockPortfolioHeader",
			nullable: false,
			resolve: async ({ id }, args, { prisma }) => {
				const stockPortfolio = await prisma.stockPortfolio.findOne({ where: { id } });

				if (!stockPortfolio) {
					return [];
				}

				const headers = stockPortfolio.headers.map((header) => {
					const { name, dataKey } = JSON.parse(header);

					return { name, dataKey };
				});

				return headers as any;
			}
		});
	}
});
