import { extendType } from "@nexus/schema";

export const orderQueries = extendType({
	type: "Query",
	definition: (t) => {
		t.crud.order();
		t.crud.orders();
	}
});
