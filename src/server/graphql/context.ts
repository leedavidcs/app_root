import { getAuthorizedUserId } from "@/server/authentication";
import { stripe } from "@/server/configs";
import { dataSources } from "@/server/datasources";
import { prisma } from "@/server/prisma";
import { isEasyCron } from "@/server/utils";
import { PrismaClient, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { AfterwareQueue } from "./plugins";

const isDevelopment: boolean = process.env.NODE_ENV === "development";

export interface IServerContext {
	afterwares: AfterwareQueue;
	dataSources: ReturnType<typeof dataSources>;
	/** `isEasyCron` is `true` by default in development mode */
	isEasyCron: boolean;
	prisma: PrismaClient;
	req: NextApiRequest;
	res: NextApiResponse;
	stripe: Stripe;
	user: User | null;
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
	const user: User | null = userId ? await prisma.user.findOne({ where: { id: userId } }) : null;

	const apolloContext: Omit<IServerContext, "dataSources"> = {
		afterwares: new AfterwareQueue(),
		isEasyCron: (await isEasyCron(req)) || isDevelopment,
		prisma,
		req,
		res,
		stripe,
		user
	};

	return apolloContext;
};
