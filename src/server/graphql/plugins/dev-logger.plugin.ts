import { GraphQLRequest } from "apollo-server-core";
import { ApolloServerPlugin } from "apollo-server-plugin-base";

const isDebug: boolean = process.env.NODE_ENV !== "production";

const isIntrospectionQuery = (request: GraphQLRequest): boolean => {
	const { operationName } = request;

	return operationName === "IntrospectionQuery";
};

/* eslint-disable no-console */
export const devLoggerPlugin: ApolloServerPlugin = {
	requestDidStart: (requestCtx) => {
		if (!isDebug) {
			return;
		}

		const { request } = requestCtx;

		if (isIntrospectionQuery(request)) {
			console.log("IntrospectionQuery fetched");
			return;
		}

		console.log("Request:\n");
		console.log("Headers:", JSON.stringify(request.http?.headers, null, 2));
		console.log("Variables", JSON.stringify(request.variables, null, 2));
		console.log("Query:", request.query);

		return {
			willSendResponse: ({ response, errors }) => {
				console.log(JSON.stringify(response, null, 2));

				if (errors) {
					console.log(JSON.stringify(errors));
				}
			}
		};
	}
};
/* eslint-enable no-console */
