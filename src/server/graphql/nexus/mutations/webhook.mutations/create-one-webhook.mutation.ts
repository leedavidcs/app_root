import { BadInputError } from "@/server/utils";
import { arg, inputObjectType, mutationField } from "@nexus/schema";

export const StockPortfolioCreateOneWithoutWebhookInput = inputObjectType({
	name: "StockPortfolioCreateOneWithoutWebhookInput",
	definition: (t) => {
		t.field("connect", { type: "StockPortfolioWhereUniqueInput" });
	}
});

export const WebhookCreateInput = inputObjectType({
	name: "WebhookCreateInput",
	definition: (t) => {
		t.string("name", { nullable: false });
		t.field("type", { type: "WebhookType", nullable: false });
		t.string("url", { nullable: false });
		t.int("timeout");
		t.field("stockPortfolio", {
			type: "StockPortfolioCreateOneWithoutWebhookInput",
			nullable: false
		});
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

		if (data.stockPortfolio.connect?.id) {
			const stockPortfolioId: string = data.stockPortfolio.connect.id;

			const connectedStockPortfolio = await prisma.stockPortfolio.findOne({
				where: { id: stockPortfolioId }
			});

			const doesUserOwnStockPortfolio: boolean = connectedStockPortfolio?.userId === user.id;

			if (!doesUserOwnStockPortfolio) {
				return false;
			}

			const existingWebhook = await prisma.webhook.findOne({
				where: {
					stockPortfolioId_name: {
						stockPortfolioId,
						name: data.name
					}
				}
			});

			if (existingWebhook) {
				return new BadInputError(`Name is already taken for this stock portfolio`);
			}
		}

		return true;
	},
	resolve: (parent, { data }, { prisma }) => prisma.webhook.create({ data })
});
