import { IServerContextWithUser } from "@/server/graphql/context";
import { PgUtils } from "@/server/utils";
import { extendType } from "@nexus/schema";
import {
	Order,
	OrderEventType,
	OrderSide,
	OrderStatus,
	OrderType,
	OrderWhereInput,
	TimeInForce
} from "@prisma/client";
import { settleAll } from "blend-promise-utils";
import { maxTime } from "date-fns";
import sql from "sql-template-tag";

const EXECUTE_ORDERS_ID = "OrderEventExecuteOrders";

const DEFAULT_ASK_PRICE = 0;
const DOLLAR_SIGFIG = 4;
const MAX_DATE_TIME = new Date(maxTime);

interface IPriceInfo {
	price: number;
	/**
	 * @description The Order.createdAt time must be before the time of the price, in order to be
	 *     executable.
	 */
	time: Date;
}

const getPriceMap = async (
	uniqueTickers: Set<string>,
	context: IServerContextWithUser,
	where: OrderWhereInput
): Promise<Map<string, Maybe<IPriceInfo>>> => {
	const { dataSources } = context;
	const { AlpacaAPI, IexCloudAPI } = dataSources;

	const symbols: readonly string[] = Array.from(uniqueTickers);
	const priceMap = new Map<string, Maybe<IPriceInfo>>();

	switch (where.timeInForce) {
		case TimeInForce.OPG:
		case TimeInForce.CLS: {
			const ohlcs = await IexCloudAPI.symbols({ symbols, select: { ohlc: true } });
			const isOpen: boolean = where.timeInForce === TimeInForce.OPG;

			Object.keys(ohlcs).forEach((symbol) => {
				const { ohlc } = ohlcs[symbol];

				const selected = isOpen ? ohlc?.open : ohlc?.close;
				const result: Maybe<IPriceInfo> = selected
					? { price: selected.price, time: new Date(selected.time) }
					: null;

				priceMap.set(symbol, result);
			});

			return priceMap;
		}
		default: {
			const { results } = await settleAll(
				symbols.map(async (ticker) => {
					const lastTrade = await AlpacaAPI.lastTrade(ticker);

					const result: Maybe<IPriceInfo> = lastTrade
						? { price: lastTrade.last.price, time: MAX_DATE_TIME }
						: null;

					return [ticker, result] as [string, Maybe<IPriceInfo>];
				})
			);

			results.forEach(([symbol, info]) => priceMap.set(symbol, info));

			return priceMap;
		}
	}
};

const getUniqueTickers = (orders: readonly Order[]): Set<string> => {
	const uniqueTickers: Set<string> = orders.reduce(
		(acc, order) => acc.add(order.ticker),
		new Set<string>()
	);

	return uniqueTickers;
};

/**
 * @description The asking price for a stock is how much a buyer is willing to pay to buy it. For
 *     limit and stop-limit orders, the highest is the limit-price. For stop orders, the highest is
 *     the stop-price. Otherwise, it will be whatever the market-price is (subject to delays).
 */
const getAskPrice = (order: Order): number | null => {
	const { limitPrice, stopPrice, type } = order;

	let askPrice: number | null = null;

	switch (type) {
		case OrderType.Limit:
		case OrderType.StopLimit:
			askPrice = limitPrice ?? DEFAULT_ASK_PRICE;

			break;
		case OrderType.Stop:
			askPrice = stopPrice ?? DEFAULT_ASK_PRICE;

			break;
		default:
			askPrice = null;
	}

	return askPrice;
};

/**
 * @description An order is executable if the order's asking price is greater than the current
 *     price of the stock.
 */
const isOrderExecutable = (order: Order, priceInfo?: Maybe<IPriceInfo>): boolean => {
	if (!priceInfo) {
		return false;
	}

	if (order.createdAt < priceInfo.time) {
		return false;
	}

	const askPrice: number | null = getAskPrice(order);

	if (askPrice === null) {
		return true;
	}

	switch (order.side) {
		case OrderSide.Buy: {
			return askPrice >= priceInfo.price;
		}
		case OrderSide.Sell: {
			return askPrice <= priceInfo.price;
		}
		default:
			return false;
	}
};

const _executeOrders = async (
	where: OrderWhereInput,
	context: IServerContextWithUser
): Promise<number> => {
	const { prisma } = context;

	const currentTime = new Date();

	const orders = await prisma.order.findMany({ where });

	const uniqueTickers: Set<string> = getUniqueTickers(orders);
	const priceMap: Map<string, Maybe<IPriceInfo>> = await getPriceMap(
		uniqueTickers,
		context,
		where
	);

	const executableOrderIds: string[] = orders
		.filter((order) => isOrderExecutable(order, priceMap[order.ticker]))
		.map(({ id }) => id);

	const valuesPrices = PgUtils.values(priceMap, (info) => info?.price);
	const valuesExecutableOrderIds = PgUtils.values(executableOrderIds);

	const updated: number = await prisma.raw<number>`
		UPDATE "Order" as ord
		SET
			filledQuantity = quantity,
			avgFilledPrice = ROUND(currentPrice, ${DOLLAR_SIGFIG}),
			filledAt = ${currentTime},
			status = ${OrderStatus.Closed}
		FROM (${valuesPrices}) as prices (ticker, currentPrice)
		WHERE ord.id = ANY (${valuesExecutableOrderIds})
		AND ord.ticker = prices.ticker;
	`;

	/**
	 * @shape {
	 *     stockPortfolioId String
	 *     ticker           String
	 *     currentPrice     Float
	 *     changeQuantity   Int
	 * }
	 */
	const details = sql`
		SELECT
			stockPortfolioId,
			ticker,
			currentPrice,
			COALESCE(
				SUM(ord.quantity * (
					CASE ord.side
					WHEN ${OrderSide.Buy} THEN
						1
					WHEN ${OrderSide.Sell} THEN
						-1
					ELSE 0
					END
				)),
				0
			) as changeQuantity
		FROM
			"Order" as ord,
			(${valuesPrices}) as prices (ticker, currentPrice)
		GROUP BY
			stockPortfolioId
			ticker
		WHERE ord.id = ANY (${valuesExecutableOrderIds})
		AND ord.ticker = prices.ticker
	`;

	await prisma.raw<number>`
		UPDATE "Position" as pos
		SET
			quantity = quantity + changeQuantity,
			costBasis = ROUND(costBasis + (changeQuantity * currentPrice), ${DOLLAR_SIGFIG}),
			avgEntryPrice = ROUND(
				(costBasis + (changeQuantity * currentPrice)) / (quantity + changeQuantity),
				${DOLLAR_SIGFIG}
			)
		FROM (${details}) as details
		WHERE pos.stockPortfolioId = details.stockPortfolioId
		AND pos.ticker = details.ticker
	`;

	return updated;
};

const handleOpgOrders = async (context: IServerContextWithUser): Promise<number> => {
	const { dataSources } = context;
	const { AlpacaAPI } = dataSources;

	const [rejectNewOrderStart, rejectNewOrderEnd] = AlpacaAPI.todayOpgRejectTimeRange;
	const [executableStart, executableEnd] = AlpacaAPI.executableOpgOrderTimeRange;

	const currentTime: Date = new Date();

	if (currentTime < rejectNewOrderStart && currentTime > rejectNewOrderEnd) {
		return 0;
	}

	const executed: number = await _executeOrders(
		{
			timeInForce: TimeInForce.OPG,
			status: OrderStatus.Open,
			createdAt: {
				lt: executableStart,
				gt: executableEnd
			}
		},
		context
	);

	return executed;
};

const handleClsOrders = async (context: IServerContextWithUser): Promise<number> => {
	const { dataSources } = context;
	const { AlpacaAPI } = dataSources;

	const [rejectNewOrderStart, rejectNewOrderEnd] = AlpacaAPI.todayClsRejectTimeRange;
	const [executableStart, executableEnd] = AlpacaAPI.executableClsOrderTimeRange;

	const currentTime: Date = new Date();

	if (currentTime < rejectNewOrderStart && currentTime > rejectNewOrderEnd) {
		return 0;
	}

	const executed: number = await _executeOrders(
		{
			timeInForce: TimeInForce.CLS,
			status: OrderStatus.Open,
			createdAt: {
				lt: executableStart,
				gt: executableEnd
			}
		},
		context
	);

	return executed;
};

const handleRegularOrders = async (context: IServerContextWithUser): Promise<number> => {
	const { dataSources } = context;
	const { AlpacaAPI } = dataSources;

	const clock = await AlpacaAPI.getClock();

	if (!clock?.is_open) {
		return 0;
	}

	const executed: number = await _executeOrders(
		{
			timeInForce: { notIn: [TimeInForce.CLS, TimeInForce.OPG] },
			status: OrderStatus.Open
		},
		context
	);

	return executed;
};

export const executeOrders = extendType({
	type: "RunScheduledEvent",
	definition: (t) => {
		t.field("executeOrders", {
			type: "Int",
			nullable: true,
			resolve: async ({ scheduledEvents }, args, context) => {
				const { prisma } = context;

				const event = await prisma.orderEvent.findOne({
					where: { type: OrderEventType.ExecuteOrders }
				});

				if (!event) {
					/**
					 * @description Create this scheduled event, if it does not currently exist.
					 *     Use an interval of 1 minute, so that this executes on each cron.
					 */
					await prisma.orderEvent.create({
						data: {
							type: OrderEventType.ExecuteOrders,
							scheduledEvent: {
								create: {
									id: EXECUTE_ORDERS_ID,
									interval: 1
								}
							}
						}
					});
				}

				const didTrigger = scheduledEvents.some(({ id }) => id === EXECUTE_ORDERS_ID);

				if (!didTrigger) {
					return 0;
				}

				const { results, errors } = await settleAll(
					[
						handleOpgOrders(context),
						handleClsOrders(context),
						handleRegularOrders(context)
					],
					(err) => {
						/* eslint-disable-next-line */
						console.error(err);

						return 0;
					}
				);

				const totalOrdersExecuted: number = [...results, ...errors].reduce(
					(sum, numExecuted) => sum + numExecuted
				);

				return totalOrdersExecuted;
			}
		});
	}
});
