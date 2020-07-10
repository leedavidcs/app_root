import { objectType } from "@nexus/schema";

export const StockPortfolioEvent = objectType({
	name: "StockPortfolioEvent",
	definition: (t) => {
		t.model.scheduledEvent();
		t.model.scheduledEventId();
		t.model.stockPortfolio();
		t.model.type();
	}
});
