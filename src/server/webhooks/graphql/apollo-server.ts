import { getApolloServer, IServerContext } from "@/server/graphql";
import { createTestClient } from "apollo-server-testing";
import { schema } from "./nexus";

interface IWebhookParams {
	id: string;
}

export const getWebooksClient = (context: IServerContext) => {
	const { prisma } = context;

	return async (params: IWebhookParams) => {
		const webhook = await prisma.webhook.findOne({
			where: { id: params.id },
			include: {
				stockPortfolio: {
					select: {
						user: true
					}
				}
			}
		});

		if (!webhook?.query) {
			return;
		}

		const webhookOwner = webhook.stockPortfolio.user;

		const server = getApolloServer(schema, {
			context: { ...context, webhook, webhookOwner },
			maxComplexity: 500,
			maxDepth: 10
		});

		const { query } = createTestClient(server);

		const result = await query({ query: webhook.query });

		if (!result.data) {
			return;
		}

		fetch(webhook.url, {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify("body")
		});
	};
};
