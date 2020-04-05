import { objectType } from "@nexus/schema";

export const StripeCard = objectType({
	name: "StripeCard",
	definition: (t) => {
		t.string("brand", { nullable: false });
		t.string("fingerprint");
		t.string("last4", { nullable: false });
		t.int("exp_month", { nullable: false });
		t.int("exp_year", { nullable: false });
	}
});
