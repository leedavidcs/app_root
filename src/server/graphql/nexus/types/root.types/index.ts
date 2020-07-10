import { inputObjectType } from "@nexus/schema";

export * from "./mutation.type";
export * from "./query.type";
export * from "./request-root.type";

export const NullableFloatFilter = inputObjectType({
	name: "NullableFloatFilter",
	definition: (t) => {
		t.float("equals");
		t.float("not");
		t.list.float("in");
		t.list.float("notIn");
		t.float("lt");
		t.float("lte");
		t.float("gt");
		t.float("gte");
	}
});

export const NullableDateTimeFilter = inputObjectType({
	name: "NullableDateTimeFilter",
	definition: (t) => {
		t.field("equals", { type: "DateTime" });
		t.field("not", { type: "DateTime" });
		t.list.field("in", { type: "DateTime" });
		t.list.field("notIn", { type: "DateTime" });
		t.field("lt", { type: "DateTime" });
		t.field("lte", { type: "DateTime" });
		t.field("gt", { type: "DateTime" });
		t.field("gte", { type: "DateTime" });
	}
});
