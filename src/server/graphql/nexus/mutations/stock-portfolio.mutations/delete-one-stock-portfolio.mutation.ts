import { PrismaUtils } from "@/server/utils";
import { arg, extendType } from "@nexus/schema";
import { last } from "lodash";

export const deleteOneStockPortfolio = extendType({
	type: "Mutation",
	definition: (t) => {
		t.field("deleteOneStockPortfolio", {
			type: "StockPortfolio",
			args: {
				where: arg({ type: "StockPortfolioWhereUniqueInput", nullable: false })
			},
			rateLimit: () => ({ window: "1m", max: 30 }),
			authorize: async (parent, args, { prisma, user }) => {
				const { where } = PrismaUtils.castInputs(args);

				if (!user) {
					return false;
				}

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
			resolve: async (parent, args, { prisma }) => {
				const { where } = PrismaUtils.castInputs(args);

				const stockPortfolio = await prisma.stockPortfolio.findOne({ where });

				if (!stockPortfolio) {
					return null;
				}

				await prisma.transaction([
					prisma.stockPortfolioSettings.delete({
						where: { stockPortfolioId: stockPortfolio.id }
					}),
					prisma.stockPortfolio.delete({ where })
				]);

				return stockPortfolio;
			}
		});
	}
});
