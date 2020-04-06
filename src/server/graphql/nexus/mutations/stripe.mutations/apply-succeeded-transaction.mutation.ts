import { UnexpectedError } from "@/server/utils";
import { mutationField, stringArg } from "@nexus/schema";

export const applySucceededTransaction = mutationField("applySucceededTransaction", {
	type: "Balance",
	args: {
		paymentIntentId: stringArg({ nullable: false })
	},
	authorize: async (parent, { paymentIntentId }, { prisma, stripe, user }) => {
		if (!user) {
			return false;
		}

		const transaction = await prisma.transaction.findOne({ where: { paymentIntentId } });

		/** User is not associated with this transaction */
		if (transaction?.userId !== user.id) {
			return false;
		}

		/** If this transaction is part of a payment, ensure that payment was successful */
		if (transaction.paymentIntentId) {
			const paymentIntent = await stripe.paymentIntents.retrieve(transaction.paymentIntentId);

			if (paymentIntent.status !== "succeeded") {
				return false;
			}
		}

		return transaction.status === "PENDING";
	},
	resolve: async (parent, { paymentIntentId }, { prisma, stripe, user }) => {
		const transaction = await prisma.transaction.findOne({ where: { paymentIntentId } });

		/** Should not reach here */
		if (!transaction) {
			throw new UnexpectedError("Transaction could not be found");
		}

		/** Should not reach here. Delete strange transaction with invalid state */
		if (!transaction.paymentIntentId) {
			await prisma.transaction.delete({ where: { id: transaction.id } });

			throw new UnexpectedError("Transaction is not a price-bundle purchase");
		}

		/**
		 * @description `transaction.creditsBefore` should equal `existingBalance.credits` if it
		 *     exists; but if for some reason they are not, give the user the benefit of the doubt,
		 *     and apply the transaction to the larger of the two.
		 * @author David Lee
		 * @date April 05, 2020
		 */
		const existingBalance = await prisma.balance.findOne({ where: { userId: user.id } });
		const creditsBefore = Math.max(transaction.creditsBefore, existingBalance?.credits || 0);

		const updatedBalance = await prisma.balance.upsert({
			where: { userId: user.id },
			create: {
				user: { connect: { id: user.id } },
				credits: transaction.creditsTransacted
			},
			update: { credits: creditsBefore + transaction.creditsTransacted }
		});

		await prisma.transaction.update({
			where: { paymentIntentId },
			data: { status: "SUCCEEDED" }
		});

		return updatedBalance;
	}
});
