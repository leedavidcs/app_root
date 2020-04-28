import { createNonApolloContext, schema } from "@/server/graphql";
import { graphql } from "graphql";
import HttpStatus from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const context = await createNonApolloContext({ req, res });

	try {
		await graphql({
			schema,
			contextValue: context,
			source: `
				mutation {
					runScheduledStockPortfolioDataRetrieve {
						scheduledEventId
					}
				}
			`
		});
	} catch (err) {
		res.writeHead(HttpStatus.INTERNAL_SERVER_ERROR, err.message);
		res.end();

		return;
	}

	res.status(HttpStatus.OK);
	res.end();
};
