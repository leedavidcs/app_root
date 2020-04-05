import { intArg, mutationField } from "@nexus/schema";

export const createStripePaymentIntent = mutationField("createStripePaymentIntent", {
	type: "JSONObject",
	args: {
		amount: intArg({ nullable: false })
	},
	resolve: async (parent, args, { stripe, user }) => {}
});
