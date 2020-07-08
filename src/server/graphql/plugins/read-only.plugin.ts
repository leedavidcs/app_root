import { IServerContext } from "@/server/graphql/context";
import { ForbiddenError } from "apollo-server-micro";
import { ApolloServerPlugin } from "apollo-server-plugin-base";
import { isIntrospectionQuery } from "./dev-logger.plugin";

interface IReadOnlyPluginConfig {
	readOnly: boolean;
}

export const readOnlyPlugin = ({
	readOnly
}: IReadOnlyPluginConfig): ApolloServerPlugin<IServerContext> => ({
	requestDidStart: ({ request }) => {
		if (isIntrospectionQuery(request)) {
			return;
		}

		if (readOnly) {
			throw new ForbiddenError("This operation is read-only, and cannot be executed");
		}
	}
});
