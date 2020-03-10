import * as Queries from "@/client/graphql/queries";
import { MockedResponse } from "@apollo/react-testing";
import Faker from "faker";

Faker.seed(1);

export const GetStockPortfolioCountMock: MockedResponse = {
	request: {
		query: Queries.GetStockPortfolioCount
	},
	result: {
		data: {
			stockPortfolioCount: 100
		}
	}
};
