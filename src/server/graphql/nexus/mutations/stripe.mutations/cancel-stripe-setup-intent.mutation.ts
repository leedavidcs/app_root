import { arg, inputObjectType, mutationField } from "@nexus/schema";

export const StripeSetupIntentCancelInput = inputObjectType({
	name: "StripeSetupIntentCancelInput",
	definition: (t) => {
		t.string("id", { nullable: false });
	}
});

/**
 * @authorize User is logged-in, and is associated with the setup-intent to be cancelled
 */
export const cancelStripeSetupIntent = mutationField("cancelStripeSetupIntent", {
	type: "StripeSetupIntent",
	args: {
		where: arg({
			type: "StripeSetupIntentCancelInput",
			nullable: false
		})
	},
	authorize: async (parent, { where }, { prisma, stripe, user }) => {
		if (!user) {
			return false;
		}

		const { id } = where;

		const setupIntent = await stripe.setupIntents.retrieve(id);
		const stripeDetails = await prisma.stripeDetails.findOne({ where: { userId: user.id } });

		const customerId: Maybe<string> = stripeDetails?.customerId;

		if (!customerId) {
			return false;
		}

		return setupIntent.customer === customerId;
	},
	resolve: async (parent, { where }, { stripe, user }) => {
		const { id } = where;

		const setupIntent = await stripe.setupIntents.cancel(id);

		return setupIntent;
	}
});
