import { objectType } from "@nexus/schema";

export const Position = objectType({
	name: "Position",
	definition: (t) => {
		t.model.id();
		t.model.stockPortfolio();
		t.model.ticker();
		t.model.quantity();
		t.model.avgEntryPrice();
		t.model.costBasis();
	}
});
