import { objectType } from "nexus";

export const StockDataSearch = objectType({
	name: "StockDataSearch",
	definition: (t) => {
		t.string("symbol", { nullable: false });
		t.string("securityName", { nullable: false });
		t.string("securityType", { nullable: false });
		t.string("region", { nullable: false  });
		t.string("exchange", { nullable: false });
	}
});
