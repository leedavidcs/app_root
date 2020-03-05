import { getAuthorizedUserId } from "@/server/authentication";
import { dataSources } from "@/server/datasources";
import { prisma } from "@/server/prisma";
import { PrismaClient, User } from "@prisma/client";
import { IncomingMessage } from "http";

export interface IServerContext {
	dataSources: ReturnType<typeof dataSources>;
	prisma: PrismaClient;
	req: IncomingMessage;
	user: User | null;
}

export type IServerContextWithUser = Omit<IServerContext, "user"> & {
	user: NonNullable<IServerContext["user"]>;
};

export const createContext = async ({ req }): Promise<Omit<IServerContext, "dataSources">> => {
	const userId: string | null = getAuthorizedUserId(req);
	const user: User | null = userId ? await prisma.user.findOne({ where: { id: userId } }) : null;

	const apolloContext: Omit<IServerContext, "dataSources"> = {
		prisma,
		req,
		user
	};

	return apolloContext;
};
