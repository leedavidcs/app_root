import { GetManyStockPortfoliosDocument } from "@/client/graphql/generated";
import { MockedResponse } from "@apollo/client/testing";
import Faker from "faker";
import { range } from "lodash";

Faker.seed(1);

const DATA_SIZE = 10;

const createdAt = Faker.date.past().toString();
const updatedAt = Faker.date.recent().toString();

const stockPortfolios = range(DATA_SIZE).map(() => ({
	id: Faker.random.uuid(),
	name: Faker.lorem.word(),
	createdAt,
	updatedAt,
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
