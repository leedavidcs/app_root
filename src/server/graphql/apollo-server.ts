import { dataSources } from "@/server/datasources";
import { schema } from "@/server/graphql/nexus";
import { getPlugins } from "@/server/graphql/plugins";
import { RedisCache } from "apollo-server-cache-redis";
import { ApolloServer } from "apollo-server-micro";
import { createContext } from "./context";
import { getValidationRules } from "./validation-rules";

const isDebug: boolean = process.env.NODE_ENV !== "production";

const cacheHost: string = process.env.REDIS_GRAPHQL_HOST || "";
const cachePort = Number(process.env.REDIS_GRAPHQL_PORT);

export interface IGetApolloServerOptions {
	maxComplexity?: number;
	maxDepth?: number;
}

export const getApolloServer = (options?: IGetApolloServerOptions) => {
	const { maxComplexity = Infinity, maxDepth = Infinity } = options || {};

	const server: ApolloServer = new ApolloServer({
		cache: new RedisCache({
			host: cacheHost,
			port: cachePort
		}),
		context: createContext,
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
