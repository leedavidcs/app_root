import { getApolloServer } from "@/server/graphql";
import { ApolloServer } from "apollo-server-micro";

const server: ApolloServer = getApolloServer({
	maxComplexity: 500,
	maxDepth: 10
});

export const config = {
	api: { bodyParser: false }
};

export default server.createHandler({ path: "/api/graphql" });
