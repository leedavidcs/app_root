import { objectType } from "@nexus/schema";

export const StripeSetupIntent = objectType({
	name: "StripeSetupIntent",
	definition: (t) => {
		t.string("id", { nullable: false });
		t.string("client_secret", { nullable: true });
		t.int("created", { nullable: false });
	}
});
