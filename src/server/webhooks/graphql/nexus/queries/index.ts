import { enumType, inputObjectType } from "@nexus/schema";

export * from "./snapshot.queries";
export * from "./stock-portfolio.queries";
export * from "./webhook-info.queries";

export const DateTimeFilter = inputObjectType({
	name: "DateTimeFilter",
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

export const StringFilter = inputObjectType({
	name: "StringFilter",
	definition: (t) => {
		t.string("equals");
		t.string("not");
		t.list.string("in");
		t.list.string("notIn");
		t.string("contains");
		t.string("startsWith");
		t.string("endsWith");
	}
});

export const OrderByArg = enumType({
	name: "OrderByArg",
	members: {
		asc: "asc",
		desc: "desc"
	}
});
