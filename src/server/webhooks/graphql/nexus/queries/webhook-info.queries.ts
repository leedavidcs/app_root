import { queryField } from "@nexus/schema";

export const webhookInfo = queryField("webhookInfo", {
	type: "WebhookInfo" as any,
	nullable: false,
	resolve: (parent, args, ctx) => ({ webhook: (ctx as any).webhook } as any)
});
