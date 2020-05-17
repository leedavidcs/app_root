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
		t.field("type", { type: "WebhookType", nullable: false });
		t.string("query");
		t.string("secret");
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
	nullable: false,
	args: {
		data: arg({ type: "WebhookCreateInput", nullable: false })
	},
	rateLimit: () => ({ window: "1m", max: 30 }),
	authorize: async (parent, { data }, { prisma, user }) => {
		if (!user) {
			return new AuthenticationError("This request requires authentication");
		}

		const stockPortfolio = await prisma.stockPortfolio.findOne({
			where: data.stockPortfolio.connect
		});

		if (stockPortfolio?.userId !== user.id) {
			return new ForbiddenError(
				"Cannot create a webhook for a stock portfolio belonging to a different user"
			);
		}

		return true;
	},
	yupValidation: (parent, { data }, { prisma }) => ({
		data: object().shape({
			url: string().required("Url is required").url("Url is invalid")
		})
	}),
	resolve: (parent, args, { prisma }) => prisma.webhook.create(args)
});
