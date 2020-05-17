import { NotFoundError } from "@/server/utils";
import { arg, inputObjectType, queryField } from "@nexus/schema";

export const WebhookWhereUniqueInput = inputObjectType({
	name: "WebhookWhereUniqueInput",
	definition: (t) => {
		t.string("id");
	}
});

export const webhook = queryField("webhook", {
	type: "Webhook",
	args: {
		where: arg({ type: "WebhookWhereUniqueInput", nullable: false })
	},
	authorize: async (parent, { where }, { prisma, user }) => {
		if (!user) {
			return false;
		}

		const retrievedWebhook = await prisma.webhook.findOne({
			where,
			include: {
				stockPortfolio: true
			}
		});

		if (!retrievedWebhook) {
			return new NotFoundError("Webhook was not found");
		}

		return retrievedWebhook.stockPortfolio.userId === user.id;
	},
	resolve: (parent, { where }, { prisma }) => prisma.webhook.findOne({ where })
});
