import { arg, inputObjectType, mutationField } from "@nexus/schema";

export const WebhookCreateInput = inputObjectType({
	name: "WebhookCreateInput",
	definition: (t) => {
		t.field("type", { type: "WebhookType", nullable: false });
		t.string("url", { description: "The url to POST to", nullable: false });
	}
});

export const createOneWebhook = mutationField("createOneWebhook", {
	type: "Webhook",
	args: {
		data: arg({ type: "WebhookCreateInput", nullable: false })
	},
	authorize: (parent, args, { user }) => Boolean(user),
	resolve: async (parent, { data }, { prisma, user }) => {
		const webhook = await prisma.webhook.create({
			data: {
				...data,
				user: { connect: { id: user.id } }
			}
		});

		return webhook;
	}
});
