import { extendType } from "@nexus/schema";

export const transactionQueries = extendType({
	type: "Query",
	definition: (t) => {
		t.crud.transactions({
			computedInputs: { user: ({ ctx }) => ctx.user },
			filtering: true,
			ordering: true
		});
	}
});
