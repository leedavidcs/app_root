import { ApolloServerPlugin } from "apollo-server-plugin-base";
import { GraphQLSchema } from "graphql";
import { afterwarePlugin } from "./afterware-queue.plugin";
import { complexityPlugin } from "./complexity.plugin";
import { devLoggerPlugin } from "./dev-logger.plugin";
import { readOnlyPlugin } from "./read-only.plugin";

export { AfterwareQueue } from "./afterware-queue.plugin";

interface IGetPluginsConfig {
	maxComplexity?: number;
	readOnly?: boolean;
	schema: GraphQLSchema;
}

export const getPlugins = ({ maxComplexity, readOnly = false, schema }: IGetPluginsConfig) => {
	const plugins: ApolloServerPlugin[] = [
		complexityPlugin({ maxComplexity, schema }),
		afterwarePlugin,
		devLoggerPlugin,
		readOnlyPlugin({ readOnly })
	];

	return plugins;
};
