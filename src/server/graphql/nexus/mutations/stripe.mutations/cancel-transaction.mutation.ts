import { mutationField, stringArg } from "@nexus/schema";

/**
 * @authorize User is logged-in. User is associated with the transaction to cancel. PaymentIntent
 *     can be cancelled. Transaction is one that is not already succeeded.
 */
export const cancelTransaction = mutationField("cancelTransaction", {
	type: "Balance",
	args: {
		paymentIntentId: stringArg({ nullable: false })
	},
	authorize: async (parent, { paymentIntentId }, { prisma, stripe, user }) => {
		/** User is logged-in */
		if (!user) {
			return false;
		}

		const transaction = await prisma.transaction.findOne({ where: { paymentIntentId } });

		/** User is associated with the transaction to cancel */
		if (user.id !== transaction?.userId) {
			return false;
		}

		/** PaymentIntent can be cancelled */
		const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
		const isPaymentCancellable: boolean =
			paymentIntent.status === "requires_action" ||
			paymentIntent.status === "requires_capture" ||
			paymentIntent.status === "requires_confirmation" ||
			paymentIntent.status === "requires_payment_method";

		if (!isPaymentCancellable) {
			return false;
		}

		/** Transaction is one that is not already succeeded */
		return transaction.status !== "SUCCEEDED";
	},
	resolve: async (parent, { paymentIntentId }, { prisma, stripe, user }) => {
		await stripe.paymentIntents.cancel(paymentIntentId);
		await prisma.transaction.update({
			where: { paymentIntentId },
			data: { status: "FAILED" }
		});

		const existingBalance = await prisma.balance.findOne({ where: { userId: user.id } });

		return existingBalance;
	}
});
