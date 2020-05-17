import { dataSources } from "@/server/datasources";
import { getPlugins } from "@/server/graphql/plugins";
import { RedisCache } from "apollo-server-cache-redis";
import { ApolloServer } from "apollo-server-micro";
import { createTestClient } from "apollo-server-testing";
import { GraphQLSchema } from "graphql";
import { NextApiRequest, NextApiResponse } from "next";
import { IServerContext } from "./context";
import { getValidationRules } from "./validation-rules";

const isDebug: boolean = process.env.NODE_ENV !== "production";

const cacheHost: string = process.env.REDIS_GRAPHQL_HOST || "";
const cachePort = Number(process.env.REDIS_GRAPHQL_PORT);

interface IContextFunctionParams {
	req: NextApiRequest;
	res: NextApiResponse;
}

export type ServerContextFunction<TContext extends Record<string, any> = IServerContext> = (
	params: IContextFunctionParams
) => Promise<Omit<TContext, "dataSources">>;

export interface IGetApolloServerOptions<TContext extends Record<string, any> = IServerContext> {
	context?: TContext | ServerContextFunction;
	maxComplexity?: number;
	maxDepth?: number;
	req?: NextApiRequest;
	res?: NextApiResponse;
}

interface IContextFunctionParams {
	req: NextApiRequest;
	res: NextApiResponse;
}

type ContextFunction = (params: IContextFunctionParams) => MaybePromise<Record<string, any>>;

export interface IGetApolloServerConfig {
	schema: GraphQLSchema;
	context?: Record<string, any> | ContextFunction;
	maxComplexity?: number;
	maxDepth?: number;
}

export const getApolloServer = (config: IGetApolloServerConfig): ApolloServer => {
	const { schema, context, maxComplexity = Infinity, maxDepth = Infinity } = config;

	const server: ApolloServer = new ApolloServer({
		cache: new RedisCache({
			host: cacheHost,
			port: cachePort
		}),
		context,
		dataSources,
		debug: isDebug,
		extensions: [],
		playground: isDebug,
		plugins: getPlugins({ maxComplexity, schema }),
		schema,
		validationRules: getValidationRules({ maxDepth })
	});

	return server;
};

export const getExecutableApolloServer = (config: IGetApolloServerConfig) => {
	return createTestClient(getApolloServer(config));
};
