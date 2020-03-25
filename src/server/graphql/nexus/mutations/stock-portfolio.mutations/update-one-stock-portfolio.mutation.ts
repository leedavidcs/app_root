import { arg, inputObjectType, mutationField } from "nexus";

export const StockPortfolioUpdateInput = inputObjectType({
	name: "StockPortfolioUpdateInput",
	definition: (t) => {
		t.string("name");
		t.field("headers", { type: "StockPortfolioHeaderInput", list: true });
		t.string("tickers", { list: true });
	}
});

export const updateOneStockPortfolio = mutationField("updateOneStockPortfolio", {
	type: "StockPortfolio",
	args: {
		data: arg({ type: "StockPortfolioUpdateInput", nullable: false }),
		where: arg({ type: "StockPortfolioWhereUniqueInput", nullable: false })
	},
	authorize: async (parent, { where }, { prisma, user }) => {
		const stockPortfolio = await prisma.stockPortfolio.findOne({
			where,
			include: { user: true }
		});

		if (!stockPortfolio) {
			return true;
		}

		const isOwnedByUser: boolean = stockPortfolio.user.id === user.id;

		return isOwnedByUser;
	},
	resolve: async (parent, { data: { name, headers, tickers }, where }, { prisma }) => {
		const stockPortfolio = await prisma.stockPortfolio.update({
			data: {
				name,
				tickers: { set: tickers },
				...(headers && {
					headers: { set: headers.map((header) => JSON.stringify(header)) }
				})
			},
			where
		});

		return stockPortfolio;
	}
});
