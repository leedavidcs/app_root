import { inputObjectType } from "@nexus/schema";

export const ScheduledEventCreatedaysInput = inputObjectType({
	name: "ScheduledEventCreatedaysInput",
	definition: (t) => {
		t.list.field("set", { type: "Day" });
	}
});

export const ScheduledEventCreateWithoutStockPortfolioEventInput = inputObjectType({
	name: "ScheduledEventCreateWithoutStockPortfolioEventInput",
	definition: (t) => {
		t.int("interval");
		t.field("recurrence", { type: "Recurrence" });
		t.field("days", { type: "ScheduledEventCreatedaysInput" });
		t.int("hour", { default: 0 });
		t.int("minute", { default: 0 });
	}
});

export const ScheduledEventCreateOneWithoutStockPortfolioEventInput = inputObjectType({
	name: "ScheduledEventCreateOneWithoutStockPortfolioEventInput",
	definition: (t) => {
		t.field("create", {
			type: "ScheduledEventCreateWithoutStockPortfolioEventInput",
			nullable: false
		});
	}
});

export const StockPortfolioCreateOneWithoutStockPortfolioEventInput = inputObjectType({
	name: "StockPortfolioCreateOneWithoutStockPortfolioEventInput",
	definition: (t) => {
		t.field("connect", { type: "StockPortfolioWhereUniqueInput", nullable: false });
	}
});

export const StockPortfolioEventCreateInput = inputObjectType({
	name: "StockPortfolioEventCreateInput",
	definition: (t) => {
		t.field("type", { type: "StockPortfolioEventType", nullable: false });
		t.field("scheduledEvent", {
			type: "ScheduledEventCreateOneWithoutStockPortfolioEventInput",
			nullable: false
		});
		t.field("stockPortfolio", {
			type: "StockPortfolioCreateOneWithoutStockPortfolioEventInput",
			nullable: false
		});
	}
});
