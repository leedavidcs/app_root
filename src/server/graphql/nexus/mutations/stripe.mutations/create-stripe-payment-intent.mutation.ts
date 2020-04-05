import { PriceBundles } from "@/server/configs";
import { intArg, mutationField, stringArg } from "@nexus/schema";

const MIN_PAYMENT_AMOUNT = PriceBundles[0].price;
const MAX_PAYMENT_AMOUNT = 99999999;

/**
 * @authorize User is logged-in, and is a registered customer of this application
 */
export const createStripePaymentIntent = mutationField("createStripePaymentIntent", {
	type: "StripePaymentIntent",
	args: {
		amount: intArg({ nullable: false }),
		paymentMethod: stringArg({ nullable: false })
	},
	authorize: async (parent, { amount }, { prisma, stripe, user }) => {
		if (!user) {
			return false;
		}

		if (amount >= MIN_PAYMENT_AMOUNT && amount <= MAX_PAYMENT_AMOUNT) {
			return false;
		}

		const stripeDetails = await prisma.stripeDetails.findOne({ where: { userId: user.id } });

		return Boolean(stripeDetails?.customerId);
	},
	resolve: async (parent, { amount, paymentMethod }, { prisma, stripe, user }) => {
		const stripeDetails = await prisma.stripeDetails.findOne({ where: { userId: user.id } });

		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency: "usd",
			customer: stripeDetails?.customerId,
			payment_method: paymentMethod
		});

		return paymentIntent;
	}
});
