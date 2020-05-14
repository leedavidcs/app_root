import { getApolloServer } from "@/server/graphql";
import { prisma } from "@/server/prisma";
import { schema } from "@/server/webhooks";
import { NextApiRequest, NextApiResponse } from "next";

const server = getApolloServer({
	schema,
	context: () => ({ prisma }),
	maxComplexity: 500,
	maxDepth: 10
});

export const config = {
	api: { bodyParser: false }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const handler = server.createHandler({ path: "/api/webhooks" });

	return await handler(req, res);
};
