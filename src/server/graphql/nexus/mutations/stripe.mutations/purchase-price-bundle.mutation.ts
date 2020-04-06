import { PriceBundles } from "@/server/configs";
import { intArg, mutationField, stringArg } from "@nexus/schema";

/**
 * @authorize User is logged-in. Payment bundle exists. User has a customer id.
 */
export const purchasePriceBundle = mutationField("purchasePriceBundle", {
	type: "StripePaymentIntent",
	args: {
		paymentMethodId: stringArg({ nullable: false }),
		priceBundleId: intArg({ nullable: false })
	},
	authorize: async (parent, { priceBundleId }, { prisma, stripe, user }) => {
		if (!user) {
			return false;
		}

		if (!PriceBundles[priceBundleId]) {
			return false;
		}

		const stripeDetails = await prisma.stripeDetails.findOne({ where: { userId: user.id } });

		return Boolean(stripeDetails?.customerId);
	},
	resolve: async (parent, { priceBundleId, paymentMethodId }, { prisma, stripe, user }) => {
		const stripeDetails = await prisma.stripeDetails.findOne({ where: { userId: user.id } });

		const selectedBundle = PriceBundles[priceBundleId];

		const paymentIntent = await stripe.paymentIntents.create({
			amount: selectedBundle.price,
			currency: "usd",
			customer: stripeDetails?.customerId,
			payment_method: paymentMethodId
		});

		const existingBalance = await prisma.balance.findOne({ where: { userId: user.id } });

		await prisma.transaction.create({
			data: {
				user: { connect: { id: user.id } },
				creditsBefore: existingBalance?.credits ?? 0,
				creditsTransacted: selectedBundle.credits,
				paymentIntentId: paymentIntent.id
			}
		});

		return paymentIntent;
	}
});
