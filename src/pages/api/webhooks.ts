import { getApolloServer } from "@/server/graphql";
import { schema } from "@/server/webhooks";
import { ApolloServer } from "apollo-server-micro";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
	api: { bodyParser: false }
};

const server: ApolloServer = getApolloServer({
	schema,
	maxComplexity: 500,
	maxDepth: 10
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const handler = server.createHandler({ path: "/api/webhooks" });

	return await handler(req, res);
};
