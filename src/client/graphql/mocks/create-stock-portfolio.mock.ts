import * as Mutations from "@/client/graphql/mutations";
import { MockedResponse } from "@apollo/react-testing";
import Faker from "faker";

Faker.seed(1);

export const CreateStockPortfolioMock: MockedResponse = {
	request: {
		query: Mutations.CreateStockPortfolio
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
