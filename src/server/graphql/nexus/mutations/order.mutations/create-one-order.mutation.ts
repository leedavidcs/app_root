import { arg, inputObjectType, mutationField } from "@nexus/schema";

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
		t.field("status", { type: "OrderStatus" });
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

export const createOneOrder = mutationField("createOneOrder", {
	type: "Order",
	nullable: true,
	args: {
		data: arg({ type: "OrderCreateInput", nullable: false })
	},
	authorize: async (parent, { data }, { prisma, user }) => {
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
	resolve: (parent, { data }, { prisma }) => prisma.order.create({ data })
});
