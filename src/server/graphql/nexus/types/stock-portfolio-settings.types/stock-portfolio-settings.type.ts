import { objectType } from "@nexus/schema";

export const StockPortfolioSettings = objectType({
	name: "StockPortfolioSettings",
	definition: (t) => {
		t.model.stockPortfolio();
		t.model.enableSnapshots();
		t.model.pollInterval();
	}
});
