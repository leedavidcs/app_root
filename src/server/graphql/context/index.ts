import { getAuthorizedUserId } from "@/server/authentication";
import { stripe } from "@/server/configs";
import { dataSources } from "@/server/datasources";
import { AfterwareQueue } from "@/server/graphql/plugins";
import { prisma } from "@/server/prisma";
import { WebhooksClient } from "@/server/webhooks";
import { PrismaClient, User } from "@prisma/client";
import { once } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { isEasyCron } from "./is-easy-cron";

const isDevelopment: boolean = process.env.NODE_ENV === "development";

export interface IServerContext {
	afterwares: AfterwareQueue;
	dataSources: ReturnType<typeof dataSources>;
	/** `isEasyCron` is `true` by default in development mode */
	isEasyCron: () => Promise<boolean>;
	prisma: PrismaClient;
	req: NextApiRequest;
	res: NextApiResponse;
	stripe: Stripe;
	user: User | null;
	webhooks: WebhooksClient;
}

export type IServerContextWithUser = Omit<IServerContext, "user"> & {
	user: NonNullable<IServerContext["user"]>;
};

export interface IServerCreateContextArgs {
	req: NextApiRequest;
	res: NextApiResponse;
}

export const createContext = async ({
	req,
	res
}: IServerCreateContextArgs): Promise<Omit<IServerContext, "dataSources">> => {
	const userId: string | null = getAuthorizedUserId(req);
	const user = await prisma.user.findOne({ where: { id: userId ?? "" } });

	const apolloContext: Omit<IServerContext, "dataSources"> = {
		afterwares: new AfterwareQueue(),
		isEasyCron: once(() => Promise.resolve<boolean>(isDevelopment || isEasyCron(req))),
		prisma,
		req,
		res,
		stripe,
		user,
		webhooks: new WebhooksClient({ context: { prisma } })
	};

	return apolloContext;
};
