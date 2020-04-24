import { getApolloServer } from "@/server/graphql";
import { ApolloServer } from "apollo-server-micro";
import { NextApiRequest, NextApiResponse } from "next";

const server: ApolloServer = getApolloServer({
	maxComplexity: 500,
	maxDepth: 10
});

export const config = {
	api: { bodyParser: false }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const handler = server.createHandler({ path: "/api/graphql" });

	return await handler(req, res);
};
