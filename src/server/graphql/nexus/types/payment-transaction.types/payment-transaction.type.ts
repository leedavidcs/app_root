import { objectType } from "@nexus/schema";

export const PaymentTransaction = objectType({
	name: "PaymentTransaction",
	definition: (t) => {
		t.model.id();
		t.model.creditsBefore();
		t.model.creditsTransacted();
		t.model.paymentIntentId();
		t.field("paymentIntent", {
			type: "StripePaymentIntent",
			authorize: async ({ id }, args, { prisma, user }) => {
				if (!user) {
					return false;
				}

				const transaction = await prisma.paymentTransaction.findOne({ where: { id } });

				return transaction?.userId === user.id;
			},
			resolve: ({ paymentIntentId }, args, { dataSources }) => {
				const { StripeAPI } = dataSources;

				if (!paymentIntentId) {
					return null;
				}

				return StripeAPI.paymentIntents.retrieve(paymentIntentId);
			}
		});
		t.model.user();
	}
});
