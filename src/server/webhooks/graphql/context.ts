import { PrismaClient, User, Webhook } from "@prisma/client";

export interface IWebhooksClientContext {
	prisma: PrismaClient;
}

export interface IWebhooksContext extends IWebhooksClientContext {
	webhook: Webhook;
	webhookOwner: User;
}

export const castContext = (value: any): IWebhooksContext => value as IWebhooksContext;
