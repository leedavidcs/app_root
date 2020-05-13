import { dataSources } from "@/server/datasources";
import { getPlugins } from "@/server/graphql/plugins";
import { User } from "@prisma/client";
import { RedisCache } from "apollo-server-cache-redis";
import { ApolloServer } from "apollo-server-micro";
import { createTestClient } from "apollo-server-testing";
import { GraphQLSchema } from "graphql";
import { NextApiRequest, NextApiResponse } from "next";
import { createContext } from "./context";
import { getValidationRules } from "./validation-rules";

const isDebug: boolean = process.env.NODE_ENV !== "production";

const cacheHost: string = process.env.REDIS_GRAPHQL_HOST || "";
const cachePort = Number(process.env.REDIS_GRAPHQL_PORT);

export interface IGetApolloServerOptions {
	maxComplexity?: number;
	maxDepth?: number;
	req?: NextApiRequest;
	res?: NextApiResponse;
	webhookOwner?: Maybe<Pick<User, "id">>;
}

export const getApolloServer = (schema: GraphQLSchema, options: IGetApolloServerOptions) => {
	const {
		maxComplexity = Infinity,
		maxDepth = Infinity,
		req: nextReq,
		res: nextRes,
		webhookOwner
	} = options;

	const server: ApolloServer = new ApolloServer({
		cache: new RedisCache({
			host: cacheHost,
			port: cachePort
		}),
		context: ({ req = nextReq, res = nextRes }) => createContext({ req, res, webhookOwner }),
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

export const getExecutableApolloServer = (
	schema: GraphQLSchema,
	options: IGetApolloServerOptions
) => createTestClient(getApolloServer(schema, options));
