import { extendType } from "@nexus/schema";
import { OrderEventType, OrderSide, OrderStatus, OrderType, Recurrence } from "@prisma/client";
import { oneLine } from "common-tags";

const DELETE_INVALID_ORDERS_ID = "OrderEventDeleteInvalidOrders";

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
				const event = await prisma.orderEvent.findOne({
					where: { type: OrderEventType.DeleteInvalidOrders }
				});

				if (!event) {
					/**
					 * @description Create this scheduled event, if it does not currently exist.
					 *     Use a daily recurrence, so that it only executes once per day (at the
					 *     start of each day).
					 */
					await prisma.orderEvent.create({
						data: {
							type: OrderEventType.DeleteInvalidOrders,
							scheduledEvent: {
								create: {
									id: DELETE_INVALID_ORDERS_ID,
									recurrence: Recurrence.Daily,
									hour: 0,
									minute: 0
								}
							}
						}
					});
				}

				const didTrigger = scheduledEvents.some(
					({ id }) => id === DELETE_INVALID_ORDERS_ID
				);

				if (!didTrigger) {
					return 0;
				}

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
