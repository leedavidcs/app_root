import { BadInputError } from "@/server/utils";
import { arg, inputObjectType, mutationField } from "@nexus/schema";

export const WebhookCreateInput = inputObjectType({
	name: "WebhookCreateInput",
	definition: (t) => {
		t.string("name", { nullable: false });
		t.field("type", { type: "WebhookType", nullable: false });
		t.string("url", { nullable: false, description: "The url to POST to" });
	}
});

export const createOneWebhook = mutationField("createOneWebhook", {
	type: "Webhook",
	args: {
		data: arg({ type: "WebhookCreateInput", nullable: false })
	},
	authorize: async (parent, { data }, { prisma, user }) => {
		if (!user) {
			return false;
		}

		const webhooks = await prisma.webhook.findMany({
			where: {
				name: data.name,
				userId: user.id
			}
		});

		if (webhooks.length !== 0) {
			return new BadInputError(`Webhook with name "${data.name}" already exists!`);
		}

		return true;
	},
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
