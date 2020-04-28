import { getAuthorizedUserId } from "@/server/authentication";
import { stripe } from "@/server/configs";
import { dataSources } from "@/server/datasources";
import { prisma } from "@/server/prisma";
import { isEasyCron } from "@/server/utils";
import { PrismaClient, User } from "@prisma/client";
import { DataSource } from "apollo-datasource";
import { RedisCache } from "apollo-server-cache-redis";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const cacheHost: string = process.env.REDIS_GRAPHQL_HOST || "";
const cachePort = Number(process.env.REDIS_GRAPHQL_PORT);

export interface IServerContext {
	dataSources: ReturnType<typeof dataSources>;
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
		isEasyCron: await isEasyCron(req),
		prisma,
		req,
		res,
		stripe,
		user
	};

	return apolloContext;
};

export const createNonApolloContext = async ({
	req,
	res
}: IServerCreateContextArgs): Promise<IServerContext> => {
	const context = await createContext({ req, res });
	const cache = new RedisCache({
		host: cacheHost,
		port: cachePort
	});

	const contextDataSources = dataSources();

	for (const key of Object.keys(contextDataSources)) {
		const dataSource: DataSource = contextDataSources[key];

		await dataSource.initialize?.({ cache, context });
	}

	return { ...context, dataSources: contextDataSources };
};
