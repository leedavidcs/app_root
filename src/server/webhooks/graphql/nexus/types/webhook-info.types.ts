import { objectType } from "@nexus/schema";

export const Webhook = objectType({
	name: "Webhook",
	definition: (t) => {
		t.model.id();
		t.model.type();
		t.model.query();
		t.model.url();
		t.model.stockPortfolio();
	}
});

export const WebhookInfo = objectType({
	name: "WebhookInfo",
	definition: (t) => {
		t.field("webhook", { type: "Webhook", nullable: false });
		t.field("calledAt", {
			type: "DateTime",
			nullable: false,
			resolve: () => new Date()
		});
	}
});
