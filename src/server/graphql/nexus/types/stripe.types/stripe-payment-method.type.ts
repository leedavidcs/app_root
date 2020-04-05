import { objectType } from "@nexus/schema";

export const StripePaymentMethod = objectType({
	name: "StripePaymentMethod",
	definition: (t) => {
		t.string("id", { nullable: false });
		t.field("card", { type: "StripeCard" });
		t.int("created", { nullable: false });
	}
});
