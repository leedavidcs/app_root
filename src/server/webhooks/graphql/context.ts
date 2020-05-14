import { IWebhooksContext } from "./apollo-server";

export const castContext = (value: any): IWebhooksContext => value as IWebhooksContext;
