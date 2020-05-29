import { IServerContextWithUser } from "@/server/graphql/context";
import { BadRequestError, PrismaUtils } from "@/server/utils";
import { arg, inputObjectType, mutationField } from "@nexus/schema";
import {
	Order,
	OrderSide,
	OrderStatus,
	OrderType,
	PositionWhereUniqueInput,
	TimeInForce
} from "@prisma/client";
import { isAfter, isBefore, set } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { lazy, number, object } from "yup";

export const StockPortfolioCreateOneWithoutOrderInput = inputObjectType({
	name: "StockPortfolioCreateOneWithoutOrderInput",
	definition: (t) => {
		t.field("connect", { type: "StockPortfolioWhereUniqueInput" });
	}
});

export const OrderCreateInput = inputObjectType({
	name: "OrderCreateInput",
	definition: (t) => {
		t.string("ticker", { nullable: false });
		t.int("quantity", { nullable: false });
		t.field("side", { type: "OrderSide", nullable: false });
		t.field("type", { type: "OrderType" });
		t.field("timeInForce", { type: "TimeInForce" });
		t.float("limitPrice");
		t.float("stopPrice");
		t.field("stockPortfolio", {
			type: "StockPortfolioCreateOneWithoutOrderInput",
			nullable: false
		});
	}
});

const isValidClsBeforeSubmitTime = (dateTime: Date): boolean => {
	const today1550: Date = set(dateTime, {
		hours: 15,
		minutes: 50
	});

	// Convert 3:50pm ET to utc
	const et1550: Date = zonedTimeToUtc(today1550, "America/New_York");

	// Check if current time (utc) is before 3:50pm ET (in utc)
	const isBeforeEt1550: boolean = isBefore(dateTime, et1550);

	return isBeforeEt1550;
};

const isValidOpgBeforeSubmitTime = (dateTime: Date): boolean => {
	const today0928: Date = set(dateTime, {
		hours: 9,
		minutes: 28
	});

	const et0928: Date = zonedTimeToUtc(today0928, "America/New_York");

	const isBeforeEt0928: boolean = isBefore(dateTime, et0928);

	return isBeforeEt0928;
};

const isValidClsOrOpgAfterSubmitTime = (dateTime: Date): boolean => {
	const today1900: Date = set(dateTime, {
		hours: 19,
		minutes: 0
	});

	// Convert 7:00pm ET to utc
	const et1900: Date = zonedTimeToUtc(today1900, "America/New_York");

	// Check if current time (utc) is before 7:00pm ET (in utc)
	const isBeforeEt1900: boolean = isAfter(dateTime, et1900);

	return isBeforeEt1900;
};

const getCurrentPriceForTicker = async (
	ticker: string,
	context: IServerContextWithUser
): Promise<number> => {
	const { dataSources } = context;
	const { AlpacaAPI } = dataSources;

	const lastQuote = await AlpacaAPI.lastQuote(ticker);

	return lastQuote?.last.askprice ?? Infinity;
};

const handleBuyOrder = async (order: Order, context: IServerContextWithUser): Promise<Order> => {
	const { prisma } = context;

	const price: number = await getCurrentPriceForTicker(order.ticker, context);
	const orderPrice: number = order.quantity * price;

	const stockPortfolio = await prisma.stockPortfolio.findOne({
		where: { id: order.stockPortfolioId }
	});

	if (stockPortfolio!.buyingPower < orderPrice) {
		throw new BadRequestError("StockPortfolio has insufficient buying power");
	}

	switch (order.type) {
		case OrderType.StopLimit:
		case OrderType.Limit:
			if (order.limitPrice! > price) {
				return order;
			}

			break;
		case OrderType.Stop:
			if (order.stopPrice! > price) {
				return order;
			}
	}

	const updated = await prisma.order.update({
		where: { id: order.id },
		data: {
			status: OrderStatus.Closed,
			avgFilledPrice: price,
			filledQuantity: order.filledQuantity,
			filledAt: new Date()
		}
	});

	const positionWhereUnique: PositionWhereUniqueInput = {
		stockPortfolioId_ticker: {
			stockPortfolioId: order.stockPortfolioId,
			ticker: order.ticker
		}
	};

	const oldPosition = await prisma.position.findOne({ where: positionWhereUnique });

	if (!oldPosition) {
		await prisma.position.create({
			data: {
				stockPortfolio: { connect: { id: order.stockPortfolioId } },
				ticker: order.ticker,
				quantity: order.quantity,
				avgEntryPrice: price,
				costBasis: orderPrice
			}
		});

		return updated;
	}

	const newQuantity: number = oldPosition.quantity + order.quantity;
	const newCostBasis: number = oldPosition.costBasis + orderPrice;
	const newAvgPrice: number = newCostBasis / newQuantity;

	await prisma.position.update({
		where: positionWhereUnique,
		data: {
			quantity: newQuantity,
			costBasis: newCostBasis,
			avgEntryPrice: newAvgPrice
		}
	});

	await prisma.stockPortfolio.update({
		where: { id: order.stockPortfolioId },
		data: { buyingPower: stockPortfolio!.buyingPower - orderPrice }
	});

	return updated;
};

const handleSellOrder = async (order: Order, context: IServerContextWithUser): Promise<Order> => {
	const { prisma } = context;

	const price: number = await getCurrentPriceForTicker(order.ticker, context);
	const orderPrice: number = order.quantity * price;

	const stockPortfolio = await prisma.stockPortfolio.findOne({
		where: { id: order.stockPortfolioId }
	});

	switch (order.type) {
		case OrderType.StopLimit:
		case OrderType.Limit:
			if (order.limitPrice! < price) {
				return order;
			}

			break;
		case OrderType.Stop:
			if (order.stopPrice! < price) {
				return order;
			}
	}

	const updated = await prisma.order.update({
		where: { id: order.id },
		data: {
			status: OrderStatus.Closed,
			avgFilledPrice: price,
			filledQuantity: order.quantity,
			filledAt: new Date()
		}
	});

	const positionWhereUnique: PositionWhereUniqueInput = {
		stockPortfolioId_ticker: {
			stockPortfolioId: order.stockPortfolioId,
			ticker: order.ticker
		}
	};

	const oldPosition = await prisma.position.findOne({ where: positionWhereUnique });

	if (!oldPosition) {
		return updated;
	}

	const newQuantity: number = oldPosition.quantity - order.quantity;
	const newCostBasis: number = oldPosition.costBasis - orderPrice;
	const newAvgPrice: number = newCostBasis / newQuantity;

	if (newQuantity <= 0) {
		await prisma.position.delete({ where: positionWhereUnique });

		return updated;
	}

	await prisma.position.update({
		where: positionWhereUnique,
		data: {
			quantity: newQuantity,
			costBasis: newCostBasis,
			avgEntryPrice: newAvgPrice
		}
	});

	await prisma.stockPortfolio.update({
		where: { id: order.stockPortfolioId },
		data: { buyingPower: stockPortfolio!.buyingPower + orderPrice }
	});

	return updated;
};

export const createOneOrder = mutationField("createOneOrder", {
	type: "Order",
	nullable: false,
	args: {
		data: arg({ type: "OrderCreateInput", nullable: false })
	},
	authorize: async (parent, args, { prisma, user }) => {
		const { data } = PrismaUtils.castInputs(args);

		if (!user) {
			return false;
		}

		const stockPortfolio = await prisma.stockPortfolio.findOne({
			where: { ...data.stockPortfolio.connect }
		});

		if (stockPortfolio?.userId !== user.id) {
			return false;
		}

		return true;
	},
	yupValidation: () => ({
		data: lazy((data) => {
			const orderType: OrderType = (data as any).type ?? OrderType.Market;

			switch (orderType) {
				case OrderType.Limit:
					return object().shape({
						limitPrice: number().required()
					});
				case OrderType.Stop:
					return object().shape({
						stopPrice: number().required()
					});
				case OrderType.StopLimit:
					return object().shape({
						limitPrice: number().required(),
						stopPrice: number().required()
					});
				default:
					return object();
			}
		})
	}),
	resolve: async (parent, args, context) => {
		const { data } = PrismaUtils.castInputs(args);
		const { dataSources, prisma } = context;
		const { AlpacaAPI } = dataSources;

		const currentTime = new Date();

		const isValidClsOrOpgAfterTime: boolean = isValidClsOrOpgAfterSubmitTime(currentTime);

		switch (data.timeInForce) {
			case TimeInForce.CLS: {
				const isValidClsBeforeTime: boolean = isValidClsBeforeSubmitTime(currentTime);

				if (!isValidClsBeforeTime && !isValidClsOrOpgAfterTime) {
					throw new BadRequestError(
						'Orders "on-close" cannot be made between 3:50 and 7:00pm ET'
					);
				}

				break;
			}
			case TimeInForce.OPG: {
				const isValidOpgBeforeTime: boolean = isValidOpgBeforeSubmitTime(currentTime);

				if (!isValidOpgBeforeTime && !isValidClsOrOpgAfterTime) {
					throw new BadRequestError(
						'Orders "on-open" cannot be made between 9:28am and 7:00pm ET'
					);
				}

				break;
			}
			default:
		}

		const order = await prisma.order.create({ data });

		switch (data.timeInForce) {
			case TimeInForce.CLS:
			case TimeInForce.OPG:
				return order;
			default:
		}

		const clock = await AlpacaAPI.getClock();

		if (!clock?.is_open) {
			return order;
		}

		switch (order.side) {
			case OrderSide.Buy: {
				const buyOrder = await handleBuyOrder(order, context);

				return buyOrder;
			}
			case OrderSide.Sell: {
				const sellOrder = await handleSellOrder(order, context);

				return sellOrder;
			}
		}
	}
});
