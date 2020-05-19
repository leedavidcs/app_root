import { arg, inputObjectType, queryField } from "@nexus/schema";

export const OrderWhereUniqueInput = inputObjectType({
	name: "OrderWhereUniqueInput",
	definition: (t) => {
		t.string("id");
	}
});

export const order = queryField("order", {
	type: "Order",
	args: {
		where: arg({ type: "OrderWhereUniqueInput", nullable: false })
	},
	authorize: (parent, args, { user }) => Boolean(user),
	resolve: async (parent, { where }, { prisma, user }) => {
		const result = await prisma.order.findOne({
			where,
			include: {
				stockPortfolio: {
					select: {
						userId: true
					}
				}
			}
		});

		if (result?.stockPortfolio.userId !== user.id) {
			return null;
		}

		return result;
	}
});
