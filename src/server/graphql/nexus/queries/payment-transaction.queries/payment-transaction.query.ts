import { PrismaUtils } from "@/server/utils";
import { arg, inputObjectType, queryField } from "@nexus/schema";
import { AuthenticationError } from "apollo-server-micro";

export const TransactionWhereUniqueInput = inputObjectType({
	name: "PaymentTransactionWhereUniqueInput",
	definition: (t) => {
		t.string("id");
		t.string("paymentIntentId");
	}
});

export const paymentTransaction = queryField("paymentTransaction", {
	type: "PaymentTransaction",
	args: {
		where: arg({ type: "PaymentTransactionWhereUniqueInput", nullable: false })
	},
	authorize: async (parent, args, { prisma, user }) => {
		const casted = PrismaUtils.castInputs(args);

		if (!user) {
			return new AuthenticationError("This request requires authentication");
		}

		const retrievedTransaction = await prisma.paymentTransaction.findOne(casted);

		if (!retrievedTransaction) {
			return true;
		}

		if (retrievedTransaction.userId !== user.id) {
			return false;
		}

		return true;
	},
	resolve: (parent, args, { prisma }) => {
		const casted = PrismaUtils.castInputs(args);

		return prisma.paymentTransaction.findOne(casted);
	}
});
