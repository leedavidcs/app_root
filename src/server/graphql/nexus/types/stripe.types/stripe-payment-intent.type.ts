import { objectType } from "@nexus/schema";

export const StripePaymentIntent = objectType({
	name: "StripePaymentIntent",
	definition: (t) => {
		t.string("id", { nullable: false });
		t.float("amount");
		t.string("client_secret");
		t.string("currency");
		t.int("created", { nullable: false });
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

				const paymentIntent = await stripe.paymentIntents.retrieve(id);

				return paymentIntent.customer === customerId;
			},
			resolve: async ({ id }, args, { stripe }) => {
				const paymentIntent = await stripe.paymentIntents.retrieve(id);

				const paymentMethod = paymentIntent.payment_method;

				if (typeof paymentMethod !== "string") {
					return paymentMethod;
				}

				return await stripe.paymentMethods.retrieve(paymentMethod);
			}
		});
	}
});
