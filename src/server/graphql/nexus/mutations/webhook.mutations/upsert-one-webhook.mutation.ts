import { arg, inputObjectType, mutationField } from "@nexus/schema";
import { AuthenticationError, ForbiddenError } from "apollo-server-micro";
import { object, string } from "yup";

export const StockPortfolioCreateOneWithoutWebhookInput = inputObjectType({
	name: "StockPortfolioCreateOneWithoutWebhookInput",
	definition: (t) => {
		t.field("connect", { type: "StockPortfolioWhereUniqueInput", nullable: false });
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

export const WebhookUpdateInput = inputObjectType({
	name: "WebhookUpdateInput",
	definition: (t) => {
		t.string("name");
		t.field("type", { type: "WebhookType" });
		t.string("url");
		t.int("timeout");
	}
});

export const upsertOneWebhook = mutationField("upsertOneWebhook", {
	type: "Webhook",
	nullable: false,
	args: {
		where: arg({ type: "WebhookWhereUniqueInput", nullable: false }),
		create: arg({ type: "WebhookCreateInput", nullable: false }),
		update: arg({ type: "WebhookUpdateInput", nullable: false })
	},
	yupValidation: () => ({
		create: object().shape({
			url: string().url("Url is invalid")
		}),
		update: object().shape({
			url: string().url("Url is invalid")
		})
	}),
	authorize: async (parent, { where, create }, { prisma, user }) => {
		if (!user) {
			return new AuthenticationError("This request requires authentication");
		}

		const stockPortfolio = await prisma.stockPortfolio.findOne({
			where: create.stockPortfolio.connect
		});

		if (stockPortfolio?.userId !== user.id) {
			return new ForbiddenError(
				"Cannot create a webhook for a stock portfolio belonging to a different user"
			);
		}

		const existing = await prisma.webhook.findOne({
			where,
			include: {
				stockPortfolio: true
			}
		});

		if (existing && existing.stockPortfolio.userId !== user.id) {
			return new ForbiddenError(
				"Cannot create a webhook for a stock portfolio belonging to a different user"
			);
		}

		return true;
	},
	resolve: (parent, { where, create, update }, { prisma }) => {
		return prisma.webhook.upsert({ where, create, update });
	}
});
