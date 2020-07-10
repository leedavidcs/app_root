import { objectType } from "@nexus/schema";

export const StripeSetupIntent = objectType({
	name: "StripeSetupIntent",
	definition: (t) => {
		t.string("id", { nullable: false });
		t.string("client_secret");
		/**
		 * @authorize User is logged-in, and is associated with the setup-intent
		 */
		t.field("payment_method", {
			type: "StripePaymentMethod",
			authorize: async ({ id }, args, { dataSources, prisma, user }) => {
				const { StripeAPI } = dataSources;

				if (!user) {
					return false;
				}

				const stripeDetails = await prisma.stripeDetails.findOne({
					where: { userId: user.id }
				});

				const customerId: Maybe<string> = stripeDetails?.customerId;

				if (!customerId) {
					return false;
				}

				const setupIntent = await StripeAPI.setupIntents.retrieve(id);

				return setupIntent.customer === customerId;
			},
			resolve: async ({ id }, args, { dataSources }) => {
				const { StripeAPI } = dataSources;

				const setupIntent = await StripeAPI.setupIntents.retrieve(id);

				const paymentMethod = setupIntent.payment_method;

				if (typeof paymentMethod !== "string") {
					return paymentMethod;
				}

				return await StripeAPI.paymentMethods.retrieve(paymentMethod);
			}
		});
		t.int("created", { nullable: false });
	}
});
