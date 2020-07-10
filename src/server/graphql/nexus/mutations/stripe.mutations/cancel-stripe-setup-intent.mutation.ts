import { mutationField, stringArg } from "@nexus/schema";

/**
 * @authorize User is logged-in, and is associated with the setup-intent to be cancelled
 */
export const cancelStripeSetupIntent = mutationField("cancelStripeSetupIntent", {
	type: "StripeSetupIntent",
	args: {
		id: stringArg({ nullable: false })
	},
	authorize: async (parent, { id }, { dataSources, prisma, user }) => {
		const { StripeAPI } = dataSources;

		if (!user) {
			return false;
		}

		const setupIntent = await StripeAPI.setupIntents.retrieve(id);
		const stripeDetails = await prisma.stripeDetails.findOne({ where: { userId: user.id } });

		const customerId: Maybe<string> = stripeDetails?.customerId;

		if (!customerId) {
			return false;
		}

		return setupIntent.customer === customerId;
	},
	resolve: async (parent, { id }, { dataSources, user }) => {
		const { StripeAPI } = dataSources;

		const setupIntent = await StripeAPI.setupIntents.cancel(id);

		return setupIntent;
	}
});
