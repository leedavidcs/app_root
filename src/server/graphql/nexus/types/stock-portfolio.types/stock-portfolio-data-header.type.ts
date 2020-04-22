import { interfaceType } from "@nexus/schema";
import { has } from "lodash";

export const StockPortfolioDataHeader = interfaceType({
	name: "StockPortfolioDataHeader",
	definition: (t) => {
		t.string("name", { nullable: false });
		t.string("dataKey", { nullable: false });
		t.resolveType((header) => {
			if (has(header, "width")) {
				return "StockPortfolioHeader";
			}

			return "SnapshotHeader";
		});
	}
});
