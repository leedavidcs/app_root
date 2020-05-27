import { extendType } from "@nexus/schema";
import { OrderSide, OrderStatus, OrderType } from "@prisma/client";
import { oneLine } from "common-tags";

export const deleteInvalidOrders = extendType({
	type: "RunScheduledEvent",
	definition: (t) => {
		t.int("deleteInvalidOrders", {
			nullable: false,
			description: oneLine`
				Deletes invalid orders (e.g. limit-orders without a limit-price, or stop-orders
				without a stop-price)
			`,
			authorize: (parent, args, { isEasyCron }) => isEasyCron(),
			resolve: async ({ scheduledEvents }, args, { prisma }) => {
				const { count } = await prisma.order.deleteMany({
					where: {
						side: OrderSide.Buy,
						status: OrderStatus.Open,
						OR: [
							{
								type: { in: [OrderType.Stop, OrderType.StopLimit] },
								OR: [{ stopPrice: { equals: null } }, { stopPrice: { lte: 0 } }]
							},
							{
								type: { in: [OrderType.Limit, OrderType.StopLimit] },
								OR: [{ limitPrice: { equals: null } }, { limitPrice: { lte: 0 } }]
							}
						]
					}
				});

				return count;
			}
		});
	}
});
