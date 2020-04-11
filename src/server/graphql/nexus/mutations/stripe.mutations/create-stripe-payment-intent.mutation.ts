import { PriceBundles } from "@/server/configs";
import { StripeUtil, UnexpectedError } from "@/server/utils";
import { arg, enumType, inputObjectType, mutationField, stringArg } from "@nexus/schema";

export const OrderDetailType = enumType({
	name: "OrderDetailType",
	members: ["PriceBundle"]
});

export const OrderDetailInput = inputObjectType({
	name: "OrderDetailInput",
	definition: (t) => {
		t.field("type", { type: "OrderDetailType", nullable: false });
		t.string("id", { nullable: false });
		t.int("quantity", { default: 1 });
	}
});

/**
 * @authorize User is logged-in. User has set-up payment (has a customer id).
 */
export const createStripePaymentIntent = mutationField("createStripePaymentIntent", {
	type: "StripePaymentIntent",
	args: {
		orderDetails: arg({
			type: "OrderDetailInput",
			nullable: false,
			list: true
		}),
		paymentMethodId: stringArg({ nullable: false })
	},
	authorize: async (parent, args, { prisma, user }) => {
		if (!user) {
			return false;
		}

		const stripeDetails = await prisma.stripeDetails.findOne({ where: { userId: user.id } });

		return Boolean(stripeDetails?.customerId);
	},
	resolve: async (parent, { paymentMethodId, orderDetails }, { prisma, stripe, user }) => {
		const stripeDetails = await prisma.stripeDetails.findOne({ where: { userId: user.id } });

		const existingBalance = await prisma.balance.findOne({ where: { userId: user.id } });
		const creditsBefore: number = existingBalance?.credits ?? 0;

		const { price, credits } = orderDetails.reduce(
			(acc, orderDetail) => {
				const { id, quantity: _quantity, type } = orderDetail;

				const quantity: number = _quantity ?? 0;

				switch (type) {
					case "PriceBundle": {
						const selectedBundle = PriceBundles[id];

						const addedPrice = quantity * selectedBundle.price;
						const addedCredits = quantity * selectedBundle.credits;

						return {
							price: acc.price + addedPrice,
							credits: acc.credits + addedCredits
						};
					}
					default:
						throw new UnexpectedError(`Received unexpected order detail type: ${type}`);
				}
			},
			{ price: 0, credits: 0 }
		);

		const currency = "usd";
		const amount: number = StripeUtil.formatAmount(price, currency);

		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency,
			customer: stripeDetails?.customerId,
			payment_method: paymentMethodId
		});

		await prisma.transaction.create({
			data: {
				user: { connect: { id: user.id } },
				creditsBefore,
				creditsTransacted: credits,
				paymentIntentId: paymentIntent.id
			}
		});

		return paymentIntent;
	}
});
