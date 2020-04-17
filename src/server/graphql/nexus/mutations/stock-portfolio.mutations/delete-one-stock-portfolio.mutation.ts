import { extendType } from "@nexus/schema";

export const deleteOneStockPortfolio = extendType({
	type: "Mutation",
	definition: (t) => {
		t.field("deleteOneStockPortfolio", {
			type: "StockPortfolio",
			args: {
				where: "StockPortfolioWhereUniqueInput"
			},
			authorize: async (parent, { where }, { prisma, user }) => {
				const stockPortfolio = await prisma.stockPortfolio.findOne({
					where,
					include: {
						user: true
					}
				});

				if (!stockPortfolio) {
					return true;
				}

				const isOwnedByUser: boolean = stockPortfolio.user.id === user.id;

				return isOwnedByUser;
			},
			resolve: (parent, { where }, { prisma }) => prisma.stockPortfolio.delete({ where })
		});
	}
});
