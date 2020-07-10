import { queryType } from "@nexus/schema";

export const Query = queryType({
	description: "Root query type",
	definition: (t) => {
		t.implements("RequestRoot");
	}
});
