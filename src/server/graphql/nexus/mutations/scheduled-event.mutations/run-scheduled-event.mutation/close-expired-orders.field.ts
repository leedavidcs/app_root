import { extendType } from "@nexus/schema";
import { OrderEventType, OrderStatus, TimeInForce } from "@prisma/client";
import { subDays } from "date-fns";

const CANCEL_EXPIRED_ORDERS_ID = "OrderEventCancelExpiredOrders";

export const closeExpiredOrders = extendType({
	type: "RunScheduledEvent",
	definition: (t) => {
		t.int("closeExpiredOrders", {
			nullable: false,
			description: "Update orders that are expired (no longer valid to be executed)",
			authorize: (parent, args, { isEasyCron }) => isEasyCron(),
			resolve: async ({ scheduledEvents, startTime }, args, { dataSources, prisma }) => {
				const { AlpacaAPI } = dataSources;

				const event = await prisma.orderEvent.findOne({
					where: { type: OrderEventType.CloseExpiredOrders }
				});

				const [clsStart, clsEnd] = AlpacaAPI.expiredClsOrderTimeRange;
				const [opgStart, opgEnd] = AlpacaAPI.executableOpgOrderTimeRange;
				const [, regularEnd] = AlpacaAPI.todayRegularTradingHours;

				const expiredDayEnd: Date = subDays(regularEnd, 1);

				if (!event) {
					/**
					 * @description Create this scheduled event, if it does not currently exist.
					 */
					await prisma.orderEvent.create({
						data: {
							type: OrderEventType.CloseExpiredOrders,
							scheduledEvent: {
								create: {
									id: CANCEL_EXPIRED_ORDERS_ID,
									interval: 20
								}
							}
						}
					});
				}

				const didTrigger = scheduledEvents.some(
					({ id }) => id === CANCEL_EXPIRED_ORDERS_ID
				);

				if (!didTrigger) {
					return 0;
				}

				const { count } = await prisma.order.updateMany({
					where: {
						status: OrderStatus.Open,
						OR: [
							{
								timeInForce: TimeInForce.CLS,
								createdAt: {
									gte: clsStart,
									lte: clsEnd
								}
							},
							{
								timeInForce: TimeInForce.OPG,
								createdAt: {
									gte: opgStart,
									lte: opgEnd
								}
							},
							{
								timeInForce: TimeInForce.Day,
								createdAt: {
									lte: expiredDayEnd
								}
							}
						]
					},
					data: {
						status: OrderStatus.Closed,
						cancelledAt: new Date(startTime)
					}
				});

				return count;
			}
		});
	}
});
