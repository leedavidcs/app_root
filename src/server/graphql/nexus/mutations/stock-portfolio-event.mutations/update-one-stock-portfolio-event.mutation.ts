import { inputObjectType } from "@nexus/schema";

export const ScheduledEventUpdatedaysInput = inputObjectType({
	name: "ScheduledEventUpdatedaysInput",
	definition: (t) => {
		t.list.field("set", { type: "Day", nullable: false });
	}
});

export const ScheduledEventUpdateWithoutStockPortfolioEventDataInput = inputObjectType({
	name: "ScheduledEventUpdateWithoutStockPortfolioEventDataInput",
	definition: (t) => {
		t.int("hour");
		t.int("minute");
		t.int("interval");
		t.field("days", { type: "ScheduledEventUpdatedaysInput" });
	}
});

export const ScheduledEventUpdateOneRequiredWithoutStockPortfolioEventInput = inputObjectType({
	name: "ScheduledEventUpdateOneRequiredWithoutStockPortfolioEventInput",
	definition: (t) => {
		t.field("update", {
			type: "ScheduledEventUpdateWithoutStockPortfolioEventDataInput",
			nullable: false
		});
	}
});

export const StockPortfolioEventUpdateInput = inputObjectType({
	name: "StockPortfolioEventUpdateInput",
	definition: (t) => {
		t.field("type", { type: "StockPortfolioEventType" });
		t.field("scheduledEvent", {
			type: "ScheduledEventUpdateOneRequiredWithoutStockPortfolioEventInput"
		});
	}
});
