import { getAuthorizedUserId } from "@/server/authentication";
import { dataSources } from "@/server/datasources";
import { AfterwareQueue } from "@/server/graphql/plugins";
import { prisma } from "@/server/prisma";
import { WebhooksClient } from "@/server/webhooks";
import { PrismaClient, User } from "@prisma/client";
import { once } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
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

export const createContext = async (
	params: IServerCreateContextArgs
): Promise<Omit<IServerContext, "dataSources">> => {
	const { req, res } = params;

	const userId: string | null = getAuthorizedUserId(req);
	const user = userId ? await prisma.user.findOne({ where: { id: userId } }) : null;

	const apolloContext: Omit<IServerContext, "dataSources"> = {
		afterwares: new AfterwareQueue(),
		isEasyCron: once(() => Promise.resolve<boolean>(isDevelopment || isEasyCron(req))),
		prisma,
		req,
		res,
		user,
		webhooks: new WebhooksClient({ context: { prisma } })
	};

	return apolloContext;
};
