import { getApolloServer } from "@/server/graphql";
import { WebhookWhereUniqueInput } from "@prisma/client";
import { createTestClient } from "apollo-server-testing";
import { timeout } from "blend-promise-utils";
import { IWebhooksClientContext } from "./context";
import { schema } from "./nexus";

/* eslint-disable no-console */

const isDevelopment: boolean = process.env.NODE_ENV === "development";

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

		const timeoutFetch = timeout(fetch, webhook.timeout);

		try {
			await timeoutFetch(webhook.url, {
				method: "post",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body)
			});
		} catch (err) {
			if (isDevelopment) {
				console.error(err);
			}
		}
	};
}
