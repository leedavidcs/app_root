import { arg, mutationField } from "@nexus/schema";
import { AuthenticationError, ForbiddenError } from "apollo-server-micro";

export const deleteOneWebhook = mutationField("deleteOneWebhook", {
	type: "Webhook",
	args: {
		where: arg({ type: "WebhookWhereUniqueInput", nullable: false })
	},
	authorize: async (parent, { where }, { prisma, user }) => {
		if (!user) {
			return new AuthenticationError("This request requires authentication");
		}

		const webhook = await prisma.webhook.findOne({
			where,
			include: { stockPortfolio: true }
		});

		if (!webhook) {
			return true;
		}

		if (webhook.stockPortfolio.userId !== user.id) {
			return new ForbiddenError(
				"Cannot delete a webhook for a stock portfolio belonging to a different user"
			);
		}

		return true;
	},
	resolve: (parent, args, { prisma }) => prisma.webhook.delete(args)
});
