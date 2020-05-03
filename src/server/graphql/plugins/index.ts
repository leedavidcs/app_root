import { ApolloServerPlugin } from "apollo-server-plugin-base";
import { GraphQLSchema } from "graphql";
import { afterwarePlugin } from "./afterware-queue.plugin";
import { complexityPlugin } from "./complexity.plugin";
import { devLoggerPlugin } from "./dev-logger.plugin";

export { AfterwareQueue } from "./afterware-queue.plugin";

interface IGetPluginsConfig {
	maxComplexity?: number;
	schema: GraphQLSchema;
}

export const getPlugins = ({ maxComplexity, schema }: IGetPluginsConfig) => {
	const plugins: ApolloServerPlugin[] = [
		complexityPlugin({ maxComplexity, schema }),
		afterwarePlugin,
		devLoggerPlugin
	];

	return plugins;
};
