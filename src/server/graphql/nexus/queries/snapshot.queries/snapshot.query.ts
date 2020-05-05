import { extendType } from "@nexus/schema";

export const snapshot = extendType({
	type: "Query",
	definition: (t) => {
		t.crud.snapshot();
	}
});
