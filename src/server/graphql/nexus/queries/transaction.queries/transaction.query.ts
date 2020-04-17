import { arg, inputObjectType, queryField } from "@nexus/schema";
import { AuthenticationError } from "apollo-server-micro";

export const TransactionWhereUniqueInput = inputObjectType({
	name: "TransactionWhereUniqueInput",
	definition: (t) => {
		t.string("id");
		t.string("paymentIntentId");
	}
});

export const transaction = queryField("transaction", {
	type: "Transaction",
	args: {
		where: arg({ type: "TransactionWhereUniqueInput", nullable: false })
	},
	authorize: async (parent, args, { prisma, user }) => {
		if (!user) {
			return new AuthenticationError("This request requires authentication");
		}

		const retrievedTransaction = await prisma.transaction.findOne(args);

		if (!retrievedTransaction) {
			return true;
		}

		if (retrievedTransaction.userId !== user.id) {
			return false;
		}

		return true;
	},
	resolve: (parent, args, { prisma }) => prisma.transaction.findOne(args)
});
