import * as Mutations from "@/client/graphql/mutations";
import { MockedResponse } from "@apollo/react-testing";
import Faker from "faker";

Faker.seed(1);

export const DeleteStockPortfolioMock: MockedResponse = {
	request: {
		query: Mutations.DeleteStockPortfolio,
		variables: { id: "" }
	},
	result: {
		data: {
			deleteOneStockPortfolio: {
				id: Faker.random.uuid(),
				name: Faker.lorem.word(),
				__typename: "StockPortfolio"
			}
		}
	}
};
