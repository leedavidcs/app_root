import { IServerContextWithUser } from "@/server/graphql/context";
import { PgUtils } from "@/server/utils";
import { objectType } from "@nexus/schema";
import {
	Order,
	OrderSide,
	OrderStatus,
	OrderType,
	OrderWhereInput,
	TimeInForce
} from "@prisma/client";
import { settleAll } from "blend-promise-utils";
import { maxTime } from "date-fns/constants";
import sql from "sql-template-tag";

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

	return askPrice >= priceInfo.price;
};

const executeBuyOrders = async (
	where: OrderWhereInput,
	context: IServerContextWithUser
): Promise<number> => {
	const { prisma } = context;

	const currentTime = new Date();

	const marketBuyOrders = await prisma.order.findMany({ where });

	const uniqueTickers: Set<string> = getUniqueTickers(marketBuyOrders);
	const priceMap: Map<string, Maybe<IPriceInfo>> = await getPriceMap(
		uniqueTickers,
		context,
		where
	);

	const executableOrderIds: string[] = marketBuyOrders
		.filter((order) => isOrderExecutable(order, priceMap[order.ticker]))
		.map(({ id }) => id);

	const valuesPrices = PgUtils.values(priceMap, (info) => info?.price);
	const valuesExecutableOrderIds = PgUtils.values(executableOrderIds);

	// REPLACE IN FOR VALUES FOR PERFORMANCE
	const updated = await prisma.raw<number>`
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

	await prisma.raw`
		UPDATE "Position" as pos
		SET
			quantity = quantity + sumQuantity,
			costBasis = ROUND(costBasis + (sumQuantity * currentPrice), ${DOLLAR_SIGFIG}),
			avgEntryPrice = ROUND(
				(costBasis + (sumQuantity * currentPrice)) / (quantity + sumQuantity),
				${DOLLAR_SIGFIG}
			)
		FROM (${sql`
			SELECT
				stockPortfolioId,
				ticker,
				currentPrice
				COALESCE(SUM(quantity), 0) as sumQuantity
			FROM "Order" as ord, (${valuesPrices}) as prices (ticker, currentPrice)
			GROUP BY
				stockPortfolioId
				ticker
			WHERE ord.id = ANY (${valuesExecutableOrderIds})
			AND ord.ticker = prices.ticker
		`}) as details
		WHERE pos.stockPortfolioId = details.stockPortfolioId
		AND pos.ticker = details.ticker;
	`;

	return updated;
};

const handleOpenBuyOrders = async (context: IServerContextWithUser): Promise<number> => {
	const { dataSources } = context;
	const { AlpacaAPI } = dataSources;

	const [rejectNewOrderStart, rejectNewOrderEnd] = AlpacaAPI.todayOpgRejectTimeRange;
	const [executableStart, executableEnd] = AlpacaAPI.executableOpgOrderTimeRange;

	const currentTime: Date = new Date();

	if (currentTime < rejectNewOrderStart && currentTime > rejectNewOrderEnd) {
		return 0;
	}

	const executed: number = await executeBuyOrders(
		{
			side: OrderSide.Buy,
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

const handleCloseBuyOrders = async (context: IServerContextWithUser): Promise<number> => {
	const { dataSources } = context;
	const { AlpacaAPI } = dataSources;

	const [rejectNewOrderStart, rejectNewOrderEnd] = AlpacaAPI.todayClsRejectTimeRange;
	const [executableStart, executableEnd] = AlpacaAPI.executableClsOrderTimeRange;

	const currentTime: Date = new Date();

	if (currentTime < rejectNewOrderStart && currentTime > rejectNewOrderEnd) {
		return 0;
	}

	const executed: number = await executeBuyOrders(
		{
			side: OrderSide.Buy,
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

const handleMidDayBuyOrders = async (context: IServerContextWithUser): Promise<number> => {
	const { dataSources } = context;
	const { AlpacaAPI } = dataSources;

	const clock = await AlpacaAPI.getClock();

	if (!clock?.is_open) {
		return 0;
	}

	const executed: number = await executeBuyOrders(
		{
			side: OrderSide.Buy,
			timeInForce: { notIn: [TimeInForce.CLS, TimeInForce.OPG] },
			status: OrderStatus.Open
		},
		context
	);

	return executed;
};

export const ExecuteOrder = objectType({
	name: "ExecuteOrder",
	definition: (t) => {
		t.field("startTime", {
			type: "DateTime",
			nullable: false
		});
		t.field("buyOrders", {
			type: "Int",
			nullable: false,
			authorize: (parent, args, { isEasyCron }) => isEasyCron(),
			resolve: async (parent, args, context) => {
				const { results } = await settleAll(
					[
						handleOpenBuyOrders(context),
						handleCloseBuyOrders(context),
						handleMidDayBuyOrders(context)
					],
					(err) => {
						/* eslint-disable-next-line */
						console.error(err);

						return 0;
					}
				);

				const totalOrdersExecuted = results.reduce((sum, numExecuted) => sum + numExecuted);

				return totalOrdersExecuted;
			}
		});
		t.field("deleteInvalidOrders", {
			type: "Int",
			nullable: false,
			authorize: (parent, args, { isEasyCron }) => isEasyCron(),
			resolve: async (parent, args, { prisma }) => {
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
