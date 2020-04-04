import { arg, mutationField, stringArg } from "@nexus/schema";
import { AddressParam } from "@stripe/stripe-js";

export const createOneStripeCustomer = mutationField("createOneStripeCustomer", {
	type: "String",
	description:
		"Creates a new Stripe customer. If one exists already, that customer is returned instead",
	args: {
		address: arg({
			type: "AddressInput"
		}),
		name: stringArg({ nullable: false })
	},
	authorize: (parent, args, { user }) => Boolean(user),
	resolve: async (parent, { address, name }, { prisma, stripe, user }) => {
		const stripeDetails = await prisma.stripeDetails.findOne({ where: { userId: user.id } });

		const stripeCustomerId: Maybe<string> = stripeDetails?.customerId;

		if (stripeCustomerId) {
			return stripeCustomerId;
		}

		const stripeAddress: Maybe<AddressParam> = address && {
			line1: address.line1,
			city: address.city ?? undefined,
			country: address.country ?? undefined,
			postal_code: address.zipcode ?? undefined,
			state: address.state ?? undefined
		};

		const newCustomer = await stripe.customers.create({
			address: stripeAddress,
			email: user.email,
			name
		});

		if (stripeDetails) {
			await prisma.stripeDetails.update({
				where: { userId: stripeDetails.userId },
				data: { customerId: newCustomer.id }
			});
		} else {
			await prisma.stripeDetails.create({
				data: {
					user: { connect: { id: user.id } },
					customerId: newCustomer.id
				}
			});
		}

		return newCustomer.id;
	}
});
