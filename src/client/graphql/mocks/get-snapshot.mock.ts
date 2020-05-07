import { GetSnapshotDocument } from "@/client/graphql/generated";
import { MockedResponse } from "@apollo/react-testing";
import Faker from "faker";
import { range } from "lodash";

Faker.seed(1);

const TICKERS_SIZE = 20;
const HEADERS_SIZE = 10;
const FAKER_YEAR = 2020;
const FAKER_MONTH = 5;
const FAKER_DATE = 15;

const uuid = Faker.random.uuid();

const tickers = range(TICKERS_SIZE).map(() => Faker.hacker.abbreviation());
const headers = range(HEADERS_SIZE).map(() => ({
	__typename: "SnapshotHeader",
	dataKey: Faker.name.lastName(),
	name: Faker.lorem.words()
}));

const data = tickers.map((ticker) => {
	const tickerData = headers.reduce(
		(acc, { dataKey }) => ({
			...acc,
			[dataKey]: Faker.random.number()
		}),
		{}
	);

	return { __typename: "JSONObject", ticker, ...tickerData };
});

export const GetSnapshotMock: MockedResponse = {
	request: {
		query: GetSnapshotDocument,
		variables: {
			where: {
				id: uuid
			}
		}
	},
	result: {
		data: {
			snapshot: {
				__typename: "Snapshot",
				id: uuid,
				tickers,
				data,
				headers,
				createdAt: Faker.date.past(
					FAKER_YEAR,
					new Date(FAKER_YEAR, FAKER_MONTH, FAKER_DATE)
				)
			}
		}
	}
};
