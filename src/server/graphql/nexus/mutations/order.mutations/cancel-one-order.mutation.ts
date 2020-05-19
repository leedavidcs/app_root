import { NotFoundError } from "@/server/utils";
import { arg, mutationField } from "@nexus/schema";
import { OrderStatus } from "@prisma/client";

export const cancelOneOrder = mutationField("cancelOneOrder", {
	type: "Order",
	args: {
		where: arg({ type: "OrderWhereUniqueInput", nullable: false })
	},
	authorize: async (parent, { where }, { prisma, user }) => {
		if (!user) {
			return false;
		}

		const order = await prisma.order.findOne({
			where,
			include: {
				stockPortfolio: {
					select: {
						userId: true
					}
				}
			}
		});

		if (!order) {
			return new NotFoundError("Order could not be found");
		}

		if (order.stockPortfolio.userId !== user.id) {
			return false;
		}

		return true;
	},
	resolve: (parent, { where }, { prisma }) => {
		return prisma.order.update({
			where,
			data: {
				cancelledAt: new Date(),
				status: OrderStatus.Closed
			}
		});
	}
});
