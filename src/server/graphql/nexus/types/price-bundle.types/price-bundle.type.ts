import { objectType } from "@nexus/schema";

export const PriceBundle = objectType({
	name: "PriceBundle",
	definition: (t) => {
		t.int("id", { nullable: false });
		t.float("price", { nullable: false });
		t.int("credits", { nullable: false });
	}
});
