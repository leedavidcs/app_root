import { mutationField } from "@nexus/schema";

export const createOneWebhook = mutationField("createOneWebhook", {
	type: "Webhook",
	args: {}
});
