import { getExecutableApolloServer, schema } from "@/server/graphql";
import gql from "graphql-tag";
import HttpStatus from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { mutate } = getExecutableApolloServer(schema, { req, res });

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
