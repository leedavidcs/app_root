import { arg, mutationField } from "@nexus/schema";

export const upsertOneWebhook = mutationField("upsertOneWebhook", {
	type: "Webhook",
	nullable: false,
	args: {
		where: arg({ type: "WebhookWhereUniqueInput", nullable: false }),
		create: arg({ type: "WebhookCreateInput", nullable: false }),
		update: arg({ type: "WebhookUpdateInput", nullable: false })
	},
	authorize: async (parent, { where, create }, { prisma, user }) => {
		if (!user) {
			return false;
		}

		const existing = await prisma.webhook.findOne({
			where,
			include: {
				stockPortfolio: {
					select: {
						userId: true
					}
				}
			}
		});

		const isUnauthorizedUpdate = existing && existing.stockPortfolio.userId !== user.id;

		if (isUnauthorizedUpdate) {
			return false;
		}

		const toConnectPortfolio = await prisma.stockPortfolio.findOne({
			where: create.stockPortfolio.connect
		});

		const isUnauthorizedCreate = toConnectPortfolio && toConnectPortfolio.userId !== user.id;

		if (isUnauthorizedCreate) {
			return false;
		}

		return true;
	},
	resolve: (parent, args, { prisma }) => prisma.webhook.upsert(args)
});
