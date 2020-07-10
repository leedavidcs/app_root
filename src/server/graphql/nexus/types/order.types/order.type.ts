import { objectType } from "@nexus/schema";

export const Order = objectType({
	name: "Order",
	definition: (t) => {
		t.model.id();
		t.model.stockPortfolio();
		t.model.ticker();
		t.model.quantity();
		t.model.type();
		t.model.side();
		t.model.status();
		t.model.timeInForce();
		t.model.limitPrice();
		t.model.stopPrice();
		t.model.avgFilledPrice();
		t.model.createdAt();
		t.model.filledAt();
		t.model.cancelledAt();
		t.model.failedAt();
	}
});
