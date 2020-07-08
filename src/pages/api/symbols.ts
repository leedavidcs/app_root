import { makeSymbolsClient } from "@/scripts/generate-symbols-schema.script";
import { schema } from "@/scripts/generated/symbols/schema";
import { getApolloServer } from "@/server/graphql";
import { ApolloServer } from "apollo-server-micro";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
	api: { bodyParser: false }
};

const client = makeSymbolsClient({ shouldGenerateArtifacts: false });

const context = () => ({ client });

const server: ApolloServer = getApolloServer({
	context,
	schema,
	maxComplexity: 500,
	maxDepth: 10,
	readOnly: true
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const handler = server.createHandler({ path: "/api/symbols" });

	return await handler(req, res);
};
