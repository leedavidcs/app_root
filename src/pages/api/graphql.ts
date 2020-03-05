import { getApolloServer } from "@/server/graphql";
import { ApolloServer } from "apollo-server-micro";

const server: ApolloServer = getApolloServer();

export const config = {
	api: { bodyParser: false }
};

export default server.createHandler({ path: "/api/graphql" });
