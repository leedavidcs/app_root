import { arg, inputObjectType, mutationField } from "@nexus/schema";
import { AuthenticationError, ForbiddenError } from "apollo-server-micro";
import { object, string } from "yup";

export const WebhookUpdateInput = inputObjectType({
	name: "WebhookUpdateInput",
	definition: (t) => {
		t.string("name");
		t.field("type", { type: "WebhookType" });
		t.string("url");
		t.int("timeout");
	}
});

export const updateOneWebhook = mutationField("updateOneWebhook", {
	type: "Webhook",
	args: {
		where: arg({ type: "WebhookWhereUniqueInput", nullable: false }),
		data: arg({ type: "WebhookUpdateInput", nullable: false })
	},
	rateLimit: () => ({ window: "1m", max: 30 }),
	authorize: async (parent, { where, data }, { prisma, user }) => {
		if (!user) {
			return new AuthenticationError("This request requires authentication");
		}

		const webhook = await prisma.webhook.findOne({
			where,
			include: { stockPortfolio: true }
		});

		if (webhook?.stockPortfolio.userId !== user.id) {
			return new ForbiddenError(
				"Cannot update a webhook for a stock portfolio belonging to a different user"
			);
		}

		return true;
	},
	yupValidation: (parent, { data, where }, { prisma }) => ({
		data: object().shape({
			name: string().test({
				message: `Webhook with name "${data.name}" already exists`,
				test: async (value) => {
					const toEdit = await prisma.webhook.findOne({
						where,
						include: { stockPortfolio: true }
					});

					const withSameName = await prisma.webhook.findOne({
						where: {
							stockPortfolioId_name: {
								stockPortfolioId: toEdit!.stockPortfolioId,
								name: value
							}
						}
					});

					if (toEdit.id !== withSameName.id) {
						return false;
					}

					return true;
				}
			}),
			url: string().url("Url is invalid")
		})
	}),
	resolve: (parent, args, { prisma }) => prisma.webhook.update(args)
});
