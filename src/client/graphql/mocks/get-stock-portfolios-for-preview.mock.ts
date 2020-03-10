import * as Queries from "@/client/graphql/queries";
import { MockedResponse } from "@apollo/react-testing";
import Faker from "faker";
import { range } from "lodash";

Faker.seed(1);

const DATA_SIZE = 10;

export const GetStockPortfoliosForPreviewMock: MockedResponse = {
	request: {
		query: Queries.GetStockPortfoliosForPreview,
		variables: { first: 10, skip: 0 }
	},
	result: {
		data: {
			stockPortfolios: range(DATA_SIZE).map(() => ({
				id: Faker.random.uuid(),
				name: Faker.lorem.word(),
				createdAt: Faker.date.past().toDateString(),
				updatedAt: Faker.date.recent().toDateString(),
				__typename: "StockPortfolio"
			}))
		}
	}
};
