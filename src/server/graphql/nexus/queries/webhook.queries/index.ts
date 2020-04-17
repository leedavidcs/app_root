import { NotFoundError } from "@/server/utils";
import { arg, extendType, inputObjectType } from "@nexus/schema";

export const StockPortfolioIdNameCompoundUniqueInput = inputObjectType({
	name: "StockPortfolioIdNameCompoundUniqueInput",
	definition: (t) => {
		t.string("stockPortfolioId", { nullable: false });
		t.string("name", { nullable: false });
	}
});

export const WebhookWhereUniqueInput = inputObjectType({
	name: "WebhookWhereUniqueInput",
	definition: (t) => {
		t.string("id");
		t.field("stockPortfolioId_name", { type: "StockPortfolioIdNameCompoundUniqueInput" });
	}
});

export const webhookQueries = extendType({
	type: "Query",
	definition: (t) => {
		t.field("webhook", {
			type: "Webhook",
			args: {
				where: arg({ type: "WebhookWhereUniqueInput", nullable: false })
			},
			authorize: async (parent, { where }, { prisma, user }) => {
				if (!user) {
					return false;
				}

				const webhook = await prisma.webhook.findOne({
					where,
					include: {
						stockPortfolio: true
					}
				});

				if (!webhook) {
					return new NotFoundError("Webhook was not found");
				}

				return webhook.stockPortfolio.userId === user.id;
			},
			resolve: (parent, { where }, { prisma }) => prisma.webhook.findOne({ where })
		});
	}
});
