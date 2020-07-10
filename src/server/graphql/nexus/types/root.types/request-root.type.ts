import { interfaceType } from "@nexus/schema";

export const RequestRoot = interfaceType({
	name: "RequestRoot",
	description: "Common properties for Query, Mutation and Subscription types",
	definition: (t) => {
		t.field("viewer", {
			type: "User",
			description: "The viewer of this request",
			resolve: (parent, args, { user }) => user
		});
		t.resolveType(() => null);
	}
});
