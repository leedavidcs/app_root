import { extendType } from "@nexus/schema";

export const snapshots = extendType({
	type: "Query",
	definition: (t) => {
		t.crud.snapshots({ filtering: true, ordering: true });
	}
});
