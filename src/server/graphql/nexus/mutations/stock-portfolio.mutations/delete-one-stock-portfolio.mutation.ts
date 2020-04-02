import { extendType } from "@nexus/schema";

export const deleteOneStockPortfolio = extendType({
	type: "Mutation",
	definition: (t) => {
		t.field("deleteOneStockPortfolio", {
			type: "StockPortfolio",
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
			}
		});
		t.crud.deleteOneStockPortfolio({
			computedInputs: {
				user: ({ ctx }) => ({ connect: { id: ctx.user.id } })
			}
		});
	}
});
