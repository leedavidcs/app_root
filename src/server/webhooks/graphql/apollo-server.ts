import { getApolloServer } from "@/server/graphql";
import { PrismaClient, User, Webhook, WebhookWhereUniqueInput } from "@prisma/client";
import { createTestClient } from "apollo-server-testing";
import { schema } from "./nexus";

interface IWebhooksClientContext {
	prisma: PrismaClient;
}

export interface IWebhooksContext extends IWebhooksClientContext {
	webhook: Webhook;
	webhookOwner: User;
}

interface IWebhooksClientParams {
	context: IWebhooksClientContext;
}

export class WebhooksClient {
	private context: IWebhooksClientContext;

	constructor({ context }: IWebhooksClientParams) {
		this.context = context;
	}

	public send = async (params: { where: WebhookWhereUniqueInput }) => {
		const { prisma } = this.context;
		const { where } = params;

		const webhook = await prisma.webhook.findOne({
			where,
			include: {
				stockPortfolio: {
					select: {
						user: true
					}
				}
			}
		});

		if (!webhook) {
			return;
		}

		let body: Record<string, any> = {};

		if (webhook.query) {
			const webhookOwner = webhook.stockPortfolio.user;

			const context = { ...this.context, webhook, webhookOwner };

			const server = getApolloServer({
				schema,
				context,
				maxComplexity: 500,
				maxDepth: 10
			});

			const { query } = createTestClient(server);

			const result = await query({ query: webhook.query });

			body = result.data ?? {};
		}

		return fetch(webhook.url, {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body)
		});
	};
}
