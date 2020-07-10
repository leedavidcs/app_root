import { extendType } from "@nexus/schema";

export const positionQueries = extendType({
	type: "Query",
	definition: (t) => {
		t.crud.position();
		t.crud.positions();
	}
});
