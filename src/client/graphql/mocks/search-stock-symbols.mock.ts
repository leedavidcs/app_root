import { SearchStockSymbolsDocument } from "@/client/graphql/generated";
import { MockedResponse } from "@apollo/react-testing";
import Faker from "faker";
import { range, uniqBy } from "lodash";

const DATA_SIZE = 10;
const stockSymbols = uniqBy(
	range(DATA_SIZE).map(() => ({
		symbol: Faker.hacker.abbreviation(),
		securityName: Faker.company.companyName(),
		__typename: "StockDataSearch"
	})),
	"symbol"
);

export const SearchStockSymbolsMock: MockedResponse = {
	request: {
		query: SearchStockSymbolsDocument,
		variables: { text: "test" }
	},
	result: {
		data: {
			stockSymbols
		}
	}
};
