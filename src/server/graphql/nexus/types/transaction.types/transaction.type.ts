import { objectType } from "@nexus/schema";

export const Transaction = objectType({
	name: "Transaction",
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

				const transaction = await prisma.transaction.findOne({ where: { id } });

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
