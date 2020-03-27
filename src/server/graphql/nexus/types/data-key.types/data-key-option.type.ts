import { objectType } from "nexus";

export const DataKeyOption = objectType({
	name: "DataKeyOption",
	description: "A single data key option that can be selected for a stock portfolio header",
	definition: (t) => {
		t.string("name", {
			nullable: false,
			description: "A more normal name. This can be shown to users."
		});
		t.string("dataKey", {
			nullable: false,
			description: "A unique data key for fetching stock portfolio data"
		});
		t.field("provider", {
			type: "DataKey_Provider",
			nullable: false,
			description: "The name of the provider"
		});
	}
});
