import { extendType } from "@nexus/schema";

export const balanceQueries = extendType({
	type: "Query",
	definition: (t) => {
		t.crud.balance();
	}
});
