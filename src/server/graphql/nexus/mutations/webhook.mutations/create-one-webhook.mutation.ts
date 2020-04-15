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

		if (data.stockPortfolio.connect) {
			const connectedStockPortfolio = await prisma.stockPortfolio.findOne({
				where: data.stockPortfolio.connect
			});

			const doesUserOwnStockPortfolio: boolean = connectedStockPortfolio?.userId === user.id;

			if (!doesUserOwnStockPortfolio) {
				return false;
			}
		}

		return true;
	},
	resolve: (parent, { data }, { prisma }) => prisma.webhook.create({ data })
});
