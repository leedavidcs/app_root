import { DeleteStockPortfolioDocument } from "@/client/graphql/generated";
import { MockedResponse } from "@apollo/client/testing";
import Faker from "faker";

Faker.seed(1);

export const DeleteStockPortfolioMock: MockedResponse = {
	request: {
		query: DeleteStockPortfolioDocument,
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
