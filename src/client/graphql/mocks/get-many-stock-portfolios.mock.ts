import { GetManyStockPortfoliosDocument } from "@/client/graphql/generated";
import { MockedResponse } from "@apollo/react-testing";
import Faker from "faker";
import { range } from "lodash";

Faker.seed(1);

const DATA_SIZE = 10;

const stockPortfolios = range(DATA_SIZE).map(() => ({
	id: Faker.random.uuid(),
	name: Faker.lorem.word(),
	createdAt: Faker.date.past().toDateString(),
	updatedAt: Faker.date.recent().toDateString(),
	__typename: "StockPortfolio"
}));

export const GetManyStockPortfoliosMock: MockedResponse = {
	request: {
		query: GetManyStockPortfoliosDocument,
		variables: {
			first: DATA_SIZE,
			skip: 0,
			where: { user: { id: { equals: undefined } } }
		}
	},
	result: {
		data: {
			stockPortfolios,
			count: DATA_SIZE
		}
	}
};
