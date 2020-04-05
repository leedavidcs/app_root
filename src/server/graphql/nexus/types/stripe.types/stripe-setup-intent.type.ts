import { objectType } from "@nexus/schema";

export const StripeSetupIntent = objectType({
	name: "StripeSetupIntent",
	definition: (t) => {
		t.string("id", { nullable: false });
		t.string("client_secret", { nullable: true });
		/**
		 * @authorize User is logged-in, and is associated with the setup-intent
		 */
		t.field("payment_method", {
			type: "StripePaymentMethod",
			authorize: async ({ id }, args, { prisma, stripe, user }) => {
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

				const setupIntent = await stripe.setupIntents.retrieve(id);

				return setupIntent.customer === customerId;
			},
			resolve: async ({ id }, args, { stripe }) => {
				const setupIntent = await stripe.setupIntents.retrieve(id);

				const paymentMethod = setupIntent.payment_method;

				if (typeof paymentMethod !== "string") {
					return paymentMethod;
				}

				return await stripe.paymentMethods.retrieve(paymentMethod);
			}
		});
		t.int("created", { nullable: false });
	}
});
