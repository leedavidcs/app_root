import { GetSnapshotsDocument, OrderByArg } from "@/client/graphql/generated";
import { MockedResponse } from "@apollo/react-testing";
import Faker from "faker";
import { range } from "lodash";

Faker.seed(1);

const DATA_SIZE = 20;
const FAKER_YEAR = 2020;
const FAKER_MONTH = 5;
const FAKER_DATE = 15;

export const GetSnapshotsMock: MockedResponse = {
	request: {
		query: GetSnapshotsDocument,
		variables: {
			where: {
				stockPortfolioId: { equals: "" },
				createdAt: { gte: null, lte: null }
			},
			orderBy: { createdAt: OrderByArg.Desc },
			first: 50
		}
	},
	result: {
		data: {
			snapshots: range(DATA_SIZE).map(() => ({
				__typename: "Snapshot",
				id: Faker.random.uuid(),
				createdAt: Faker.date.past(
					FAKER_YEAR,
					new Date(FAKER_YEAR, FAKER_MONTH, FAKER_DATE)
				)
			}))
		}
	}
};
