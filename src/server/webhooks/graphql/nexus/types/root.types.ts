import { queryType } from "@nexus/schema";

export const Query = queryType({
	description: "Root query type",
	definition: (t) => {
		t.boolean("ok", {
			nullable: false,
			resolve: () => true
		});
	}
});
