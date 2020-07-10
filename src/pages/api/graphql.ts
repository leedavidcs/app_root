import { createContext, getApolloServer, schema } from "@/server/graphql";
import { ApolloServer } from "apollo-server-micro";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
	api: { bodyParser: false }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const server: ApolloServer = getApolloServer({
		schema,
		context: createContext,
		maxComplexity: 500,
		maxDepth: 10
	});

	const handler = server.createHandler({ path: "/api/graphql" });

	return await handler(req, res);
};
