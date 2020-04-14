import { ApolloLink } from "apollo-boost";
import { createHttpLink } from "apollo-link-http";

const BASE_GRAPHQL_URL = `${process.env.API_BASE_URL}/api/graphql`;

export const HttpLink: ApolloLink = createHttpLink({
	uri: BASE_GRAPHQL_URL
});
