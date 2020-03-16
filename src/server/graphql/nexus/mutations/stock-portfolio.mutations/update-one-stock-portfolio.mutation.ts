import { extendType } from "nexus";

export const updateOneStockPortfolio = extendType({
	type: "Mutation",
	definition: (t) => {
		t.field("updateOneStockPortfolio", {
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
		t.crud.updateOneStockPortfolio({
			computedInputs: {
				id: () => undefined,
				createdAt: () => undefined,
				updatedAt: () => undefined,
				user: ({ ctx }) => ({ connect: { id: ctx.user.id } })
			}
		});
	}
});
