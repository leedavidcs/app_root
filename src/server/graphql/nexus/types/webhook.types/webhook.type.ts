import { objectType } from "@nexus/schema";

export const Webhook = objectType({
	name: "Webhook",
	definition: (t) => {
		t.model.id();
		t.model.timeout();
		t.model.type();
		t.model.url();
		t.model.user();
		t.model.createdAt();
	}
});
