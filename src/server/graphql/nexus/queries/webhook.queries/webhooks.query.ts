import { arg, inputObjectType, intArg, queryField } from "@nexus/schema";
import { AuthenticationError } from "apollo-server-micro";

export const WebhookOrderByInput = inputObjectType({
	name: "WebhookOrderByInput",
	definition: (t) => {
		t.field("name", { type: "OrderByArg" });
		t.field("createdAt", { type: "OrderByArg" });
	}
});

export const StockPortfolioWhereWithoutUserInput = inputObjectType({
	name: "StockPortfolioWhereWithoutUserInput",
	definition: (t) => {
		t.field("id", { type: "StringFilter" });
		t.field("name", { type: "StringFilter" });
		t.field("createdAt", { type: "DateTimeFilter" });
		t.field("updatedAt", { type: "DateTimeFilter" });
		t.field("webhook", { type: "WebhookFilter" });
		t.field("AND", { type: "StockPortfolioWhereWithoutUserInput", list: true });
		t.field("OR", { type: "StockPortfolioWhereWithoutUserInput", list: true });
		t.field("NOT", { type: "StockPortfolioWhereWithoutUserInput", list: true });
	}
});

export const WebhookWhereInput = inputObjectType({
	name: "WebhookWhereInput",
	definition: (t) => {
		t.field("id", { type: "StringFilter" });
		t.field("stockPortfolioId", { type: "StringFilter" });
		t.field("name", { type: "StringFilter" });
		t.field("type", { type: "WebhookType" });
		t.field("url", { type: "StringFilter" });
		t.field("timeout", { type: "IntFilter" });
		t.field("createdAt", { type: "DateTimeFilter" });
		t.field("AND", { type: "WebhookWhereInput", list: true });
		t.field("OR", { type: "WebhookWhereInput", list: true });
		t.field("NOT", { type: "WebhookWhereInput", list: true });
		t.field("stockPortfolio", { type: "StockPortfolioWhereWithoutUserInput" });
	}
});

export const webhooks = queryField("webhooks", {
	type: "Webhook",
	list: true,
	nullable: false,
	args: {
		where: arg({ type: "WebhookWhereInput" }),
		orderBy: arg({ type: "WebhookOrderByInput" }),
		skip: intArg(),
		after: arg({ type: "WebhookWhereUniqueInput" }),
		before: arg({ type: "WebhookWhereUniqueInput" }),
		first: intArg(),
		last: intArg()
	},
	authorize: (parent, { where }, { prisma, user }) => {
		if (!user) {
			return new AuthenticationError("This request requires authentication");
		}

		return true;
	},
	resolve: (parent, args, { prisma, user }) => {
		return prisma.webhook.findMany({
			...args,
			where: {
				...args.where,
				stockPortfolio: {
					...args.where?.stockPortfolio,
					userId: { equals: user.id }
				}
			}
		});
	}
});
