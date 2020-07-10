import { getApolloServer } from "@/server/graphql";
import { Logger } from "@/server/utils";
import { User, Webhook, WebhookWhereInput, WebhookWhereUniqueInput } from "@prisma/client";
import { ApolloServer } from "apollo-server-micro";
import { createTestClient } from "apollo-server-testing";
import { settleAll, timeout } from "blend-promise-utils";
import crypto, { Hmac } from "crypto";
import { IWebhooksClientContext } from "./context";
import { schema } from "./nexus";

const WEBHOOK_BASE_NAME: string = process.env.WEBHOOK_BASE_NAME ?? "";

interface IWebhooksClientParams {
	context: IWebhooksClientContext;
}

export class WebhooksClient {
	private context: IWebhooksClientContext;

	constructor({ context }: IWebhooksClientParams) {
		this.context = context;
	}

	public sendOne = async (params: { where: WebhookWhereUniqueInput }): Promise<void> => {
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

		try {
			await this.processWebhook(webhook);
		} catch (err) {
			Logger.error(err.message ?? err);
		}
	};

	public sendMany = async (params: { where: WebhookWhereInput }): Promise<void> => {
		const { prisma } = this.context;
		const { where } = params;

		const webhooks = await prisma.webhook.findMany({
			where,
			include: {
				stockPortfolio: {
					select: {
						user: true
					}
				}
			}
		});

		try {
			await settleAll(webhooks.map(this.processWebhook), (err) => {
				Logger.error(err.message ?? err);
			});
		} catch (err) {
			Logger.error(err.message ?? err);
		}
	};

	private processWebhook = async (
		webhook: Webhook & { stockPortfolio: { user: User } }
	): Promise<void> => {
		let body: Record<string, any> = {};

		if (webhook.query) {
			const webhookOwner = webhook.stockPortfolio.user;

			const context = { ...this.context, webhook, webhookOwner };

			const server: ApolloServer = getApolloServer({
				schema,
				context,
				maxComplexity: 500,
				maxDepth: 10
			});

			const { query } = createTestClient(server);

			const result = await query({ query: webhook.query });

			body = result.data ?? {};
		}

		const signatureHeader = this.createSignatureHeader(webhook.secret, body);

		const timeoutFetch = timeout(fetch, webhook.timeout);

		try {
			await timeoutFetch(webhook.url, {
				method: "post",
				headers: {
					"Content-Type": "application/json",
					...signatureHeader
				},
				body: JSON.stringify(body)
			});
		} catch (err) {
			Logger.error(err.message ?? err);
		}
	};

	private createSignatureHeader = (
		secret: Maybe<string>,
		payload: Record<string, any>
	): Record<string, string> => {
		if (!secret) {
			return {};
		}

		const hmac: Hmac = crypto.createHmac("sha1", secret);
		const signature: string = hmac.update(JSON.stringify(payload)).digest("hex");

		return { [`X-${WEBHOOK_BASE_NAME}-Signature`]: `sha1=${signature}` };
	};
}
