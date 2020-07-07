import { PrismaUtils } from "@/server/utils";
import { arg, inputObjectType, intArg, queryField } from "@nexus/schema";

export const OrderOrderByInput = inputObjectType({
	name: "OrderOrderByInput",
	definition: (t) => {
		t.field("ticker", { type: "OrderByArg" });
		t.field("quantity", { type: "OrderByArg" });
		t.field("type", { type: "OrderByArg" });
		t.field("side", { type: "OrderByArg" });
		t.field("status", { type: "OrderByArg" });
		t.field("limitPrice", { type: "OrderByArg" });
		t.field("stopPrice", { type: "OrderByArg" });
		t.field("avgFilledPrice", { type: "OrderByArg" });
		t.field("timeInForce", { type: "OrderByArg" });
		t.field("createdAt", { type: "OrderByArg" });
		t.field("filledAt", { type: "OrderByArg" });
		t.field("cancelledAt", { type: "OrderByArg" });
		t.field("failedAt", { type: "OrderByArg" });
	}
});

export const OrderWhereInput = inputObjectType({
	name: "OrderWhereInput",
	definition: (t) => {
		t.field("id", { type: "StringFilter" });
		t.field("stockPortfolioId", { type: "StringFilter" });
		t.field("ticker", { type: "StringFilter" });
		t.field("quantity", { type: "IntFilter" });
		t.field("type", { type: "OrderType" });
		t.field("side", { type: "OrderSide" });
		t.field("status", { type: "OrderStatus" });
		t.field("limitPrice", { type: "NullableFloatFilter" });
		t.field("stopPrice", { type: "NullableFloatFilter" });
		t.field("avgFilledPrice", { type: "NullableFloatFilter" });
		t.field("timeInForce", { type: "TimeInForce" });
		t.field("createdAt", { type: "DateTimeFilter" });
		t.field("filledAt", { type: "NullableDateTimeFilter" });
		t.field("cancelledAt", { type: "NullableDateTimeFilter" });
		t.field("failedAt", { type: "NullableDateTimeFilter" });
		t.field("stockPortfolio", { type: "StockPortfolioWhereInput" });
		t.list.field("AND", { type: "OrderWhereInput" });
		t.list.field("OR", { type: "OrderWhereInput" });
		t.list.field("NOT", { type: "OrderWhereInput" });
	}
});

export const orders = queryField("orders", {
	type: "Order",
	list: true,
	nullable: false,
	args: {
		where: arg({ type: "OrderWhereInput" }),
		orderBy: arg({ type: "OrderOrderByInput" }),
		skip: intArg(),
		cursor: arg({ type: "OrderWhereUniqueInput" }),
		take: intArg()
	},
	authorize: (parent, args, { user }) => Boolean(user),
	resolve: async (parent, args, { prisma, user }) => {
		const { where, orderBy, skip, cursor, take } = PrismaUtils.castInputs(args);

		return await prisma.order.findMany({
			where: {
				...where,
				stockPortfolio: {
					...where?.stockPortfolio,
					userId: user.id
				}
			},
			orderBy,
			skip,
			cursor,
			take
		});
	}
});
