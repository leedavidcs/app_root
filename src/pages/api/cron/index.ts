import { createContext, getExecutableApolloServer, schema } from "@/server/graphql";
import { gql } from "@apollo/client";
import HttpStatus from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { mutate } = getExecutableApolloServer({
		schema,
		context: () => createContext({ req, res }),
		maxComplexity: 500,
		maxDepth: 10
	});

	try {
		const { errors } = await mutate({
			mutation: gql`
				mutation {
					runScheduledEvent {
						startTime
						stockDataRetrieved {
							scheduledEventId
						}
					}
				}
			`
		});

		if (errors) {
			throw new Error(errors.map(({ message }) => message).join(", "));
		}
	} catch (err) {
		if (err instanceof Error) {
			res.writeHead(HttpStatus.INTERNAL_SERVER_ERROR, err.message);
		}

		res.status(HttpStatus.INTERNAL_SERVER_ERROR);
		res.end();

		return;
	}

	res.status(HttpStatus.OK);
	res.end();
};
