import Stripe from "stripe";

const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY ?? "";

export const stripe = new Stripe(stripeSecretKey, {
	apiVersion: "2020-03-02",
	typescript: true
});
