import { CreateStockPortfolioDocument } from "@/client/graphql/generated";
import { MockedResponse } from "@apollo/client/testing";
import Faker from "faker";

Faker.seed(1);

export const CreateStockPortfolioMock: MockedResponse = {
	request: {
		query: CreateStockPortfolioDocument
	},
	result: {
		data: {
			createOneStockPortfolio: {
				id: Faker.random.uuid(),
				name: Faker.lorem.word(),
				__typename: "StockPortfolio"
			}
		}
	}
};
