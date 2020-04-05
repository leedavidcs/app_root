import { objectType } from "@nexus/schema";

export const StripePaymentIntent = objectType({
	name: "StripePaymentIntent",
	definition: (t) => {
		t.string("id", { nullable: false });
		t.int("amount");
		t.string("client_secret");
		t.string("currency");
		t.int("created", { nullable: false });
	}
});
