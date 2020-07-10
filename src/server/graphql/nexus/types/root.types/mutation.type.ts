import { mutationType } from "@nexus/schema";

export const Mutation = mutationType({
	description: "Root mutation type",
	definition: (t) => {
		t.implements("RequestRoot");
	}
});
