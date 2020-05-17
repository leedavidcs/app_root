import { arg, inputObjectType, intArg, queryField } from "@nexus/schema";
import { AuthenticationError } from "apollo-server-micro";

export const WebhookOrderByInput = inputObjectType({
	name: "WebhookOrderByInput",
	definition: (t) => {
		t.field("createdAt", { type: "OrderByArg" });
	}
});

export const StockPortfolioWhereWithoutUserInput = inputObjectType({
	name: "StockPortfolioWhereWithoutUserInput",
	definition: (t) => {
		t.field("id", { type: "StringFilter" });
		t.field("createdAt", { type: "DateTimeFilter" });
		t.field("updatedAt", { type: "DateTimeFilter" });
		t.field("webhook", { type: "WebhookFilter" });
		t.list.field("AND", { type: "StockPortfolioWhereWithoutUserInput" });
		t.list.field("OR", { type: "StockPortfolioWhereWithoutUserInput" });
		t.list.field("NOT", { type: "StockPortfolioWhereWithoutUserInput" });
	}
});

export const WebhookWhereInput = inputObjectType({
	name: "WebhookWhereInput",
	definition: (t) => {
		t.field("id", { type: "StringFilter" });
		t.field("stockPortfolioId", { type: "StringFilter" });
		t.field("type", { type: "WebhookType" });
		t.field("url", { type: "StringFilter" });
		t.field("timeout", { type: "IntFilter" });
		t.field("createdAt", { type: "DateTimeFilter" });
		t.list.field("AND", { type: "WebhookWhereInput" });
		t.list.field("OR", { type: "WebhookWhereInput" });
		t.list.field("NOT", { type: "WebhookWhereInput" });
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
