import { NotFoundError, PrismaUtils } from "@/server/utils";
import { arg, mutationField } from "@nexus/schema";
import { OrderStatus } from "@prisma/client";

export const cancelOneOrder = mutationField("cancelOneOrder", {
	type: "Order",
	args: {
		where: arg({ type: "OrderWhereUniqueInput", nullable: false })
	},
	authorize: async (parent, args, { prisma, user }) => {
		const { where } = PrismaUtils.castInputs(args);

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

		if (order.status !== OrderStatus.Open) {
			return false;
		}

		return true;
	},
	resolve: (parent, args, { prisma }) => {
		const { where } = PrismaUtils.castInputs(args);

		return prisma.order.update({
			where,
			data: {
				cancelledAt: new Date(),
				status: OrderStatus.Closed
			}
		});
	}
});
