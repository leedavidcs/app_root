import { objectType } from "@nexus/schema";

export const Balance = objectType({
	name: "Balance",
	definition: (t) => {
		t.model.credits();
		t.model.user();
	}
});
