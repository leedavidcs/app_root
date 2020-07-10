import { PrismaUtils } from "@/server/utils";
import { arg, inputObjectType, intArg, queryField } from "@nexus/schema";
import { AuthenticationError } from "apollo-server-micro";

export const PaymentTransactionOrderByInput = inputObjectType({
	name: "PaymentTransactionOrderByInput",
	definition: (t) => {
		t.field("creditsBefore", { type: "OrderByArg" });
		t.field("creditsTransacted", { type: "OrderByArg" });
		t.field("createdAt", { type: "OrderByArg" });
	}
});

export const PaymentTransactionWhereWithoutUserInput = inputObjectType({
	name: "PaymentTransactionWhereWithoutUserInput",
	definition: (t) => {
		t.field("id", { type: "StringFilter" });
		t.field("creditsBefore", { type: "IntFilter" });
		t.field("creditsTransacted", { type: "IntFilter" });
		t.field("createdAt", { type: "DateTimeFilter" });
		t.field("paymentIntentId", { type: "NullableStringFilter" });
		t.field("status", { type: "PaymentTransactionStatus" });
		t.list.field("AND", { type: "PaymentTransactionWhereWithoutUserInput" });
		t.list.field("OR", { type: "PaymentTransactionWhereWithoutUserInput" });
		t.list.field("NOT", { type: "PaymentTransactionWhereWithoutUserInput" });
	}
});

export const paymentTransactions = queryField("paymentTransactions", {
	type: "PaymentTransaction",
	list: true,
	nullable: false,
	args: {
		where: arg({ type: "PaymentTransactionWhereWithoutUserInput" }),
		skip: intArg(),
		cursor: arg({ type: "PaymentTransactionWhereUniqueInput" }),
		take: intArg()
	},
	authorize: (parent, args, { user }) => {
		if (!user) {
			return new AuthenticationError("This request requires authentication");
		}

		return true;
	},
	resolve: (parent, args, { prisma, user }) => {
		const casted = PrismaUtils.castInputs(args);

		return prisma.paymentTransaction.findMany({
			...casted,
			where: {
				...casted.where,
				userId: { equals: user.id }
			}
		});
	}
});
