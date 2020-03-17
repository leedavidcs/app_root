import { GetStockPortfolioCountDocument } from "@/client/graphql/generated";
import { MockedResponse } from "@apollo/react-testing";
import Faker from "faker";

Faker.seed(1);

export const GetStockPortfolioCountMock: MockedResponse = {
	request: {
		query: GetStockPortfolioCountDocument
	},
	result: {
		data: {
			stockPortfolioCount: 100
		}
	}
};
