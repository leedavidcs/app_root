import { UnexpectedError } from "@/server/utils";
import { mutationField } from "@nexus/schema";
import Stripe from "stripe";

export const createStripeSetupIntent = mutationField("createStripeSetupIntent", {
	type: "StripeSetupIntent",
	authorize: (parent, args, { user }) => Boolean(user),
	resolve: async (parent, args, { prisma, stripe, user }) => {
		const stripeDetails = await prisma.stripeDetails.findOne({
			where: { userId: user.id }
		});

		const existingCustomer: Maybe<string> = stripeDetails?.customerId;

		let stripeCustomer: Stripe.Customer | Stripe.DeletedCustomer;

		try {
			stripeCustomer = existingCustomer
				? await stripe.customers.retrieve(existingCustomer)
				: await stripe.customers.create({ email: user.email });
		} catch (err) {
			throw new UnexpectedError("Stripe customer could not be found");
		}

		if (!existingCustomer) {
			await prisma.stripeDetails.create({
				data: {
					user: { connect: { id: user.id } },
					customerId: stripeCustomer.id
				}
			});
		}

		const setupIntent = await stripe.setupIntents.create({
			customer: stripeCustomer.id
		});

		return setupIntent;
	}
});
