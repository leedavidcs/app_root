import { PrismaUtils } from "@/server/utils";
import { arg, inputObjectType, intArg, queryField } from "@nexus/schema";
import { AuthenticationError } from "apollo-server-micro";

export const TransactionOrderByInput = inputObjectType({
	name: "TransactionOrderByInput",
	definition: (t) => {
		t.field("creditsBefore", { type: "OrderByArg" });
		t.field("creditsTransacted", { type: "OrderByArg" });
		t.field("createdAt", { type: "OrderByArg" });
	}
});

export const TransactionWhereWithoutUserInput = inputObjectType({
	name: "TransactionWhereWithoutUserInput",
	definition: (t) => {
		t.field("id", { type: "StringFilter" });
		t.field("creditsBefore", { type: "IntFilter" });
		t.field("creditsTransacted", { type: "IntFilter" });
		t.field("createdAt", { type: "DateTimeFilter" });
		t.field("paymentIntentId", { type: "NullableStringFilter" });
		t.field("status", { type: "TransactionStatus" });
		t.list.field("AND", { type: "TransactionWhereWithoutUserInput" });
		t.list.field("OR", { type: "TransactionWhereWithoutUserInput" });
		t.list.field("NOT", { type: "TransactionWhereWithoutUserInput" });
	}
});

export const transactions = queryField("transactions", {
	type: "Transaction",
	list: true,
	nullable: false,
	args: {
		where: arg({ type: "TransactionWhereWithoutUserInput" }),
		skip: intArg(),
		cursor: arg({ type: "TransactionWhereUniqueInput" }),
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

		return prisma.transaction.findMany({
			...casted,
			where: {
				...casted.where,
				userId: { equals: user.id }
			}
		});
	}
});
