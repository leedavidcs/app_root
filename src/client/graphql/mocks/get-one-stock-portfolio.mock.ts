import { GetOneStockPortfolioDocument, GetStockDataDocument } from "@/client/graphql/generated";
import { MockedResponse } from "@apollo/react-testing";
import Faker from "faker";
import { range, uniqBy } from "lodash";
import { mockUser } from "./get-user.mock";

Faker.seed(1);

const HEADERS_COUNT = 20;
const TICKERS_COUNT = 50;

const mockHeaders = range(HEADERS_COUNT).map(() => ({
	name: Faker.lorem.words(),
	dataKey: Faker.name.lastName(),
	width: Faker.random.number({ min: 50, max: 100 }),
	frozen: false,
	resizable: true,
	__typename: "StockPortfolioHeader"
}));

const uniqueMockHeaders = uniqBy(mockHeaders, "name");

const mockTickers = range(TICKERS_COUNT).map(() => Faker.hacker.abbreviation());

const mockData = mockTickers.map((ticker) => {
	const headerKeys: readonly string[] = uniqueMockHeaders.map(({ dataKey }) => dataKey);

	return headerKeys.reduce<Record<string, any>>(
		(acc, key) => ({
			...acc,
			[key]: Faker.random.number({ min: -100, max: 100 })
		}),
		{ ticker }
	);
});

export const GetOneStockPortfolioMock: MockedResponse = {
	request: {
		query: GetOneStockPortfolioDocument,
		variables: { where: { id: "" } }
	},
	result: {
		data: {
			stockPortfolio: {
				id: Faker.random.uuid(),
				name: Faker.name.findName(),
				headers: uniqueMockHeaders,
				tickers: mockTickers,
				createdAt: Faker.date.past().toDateString(),
				updatedAt: Faker.date.recent().toDateString(),
				user: {
					id: mockUser.id,
					username: mockUser.username,
					__typename: "User"
				},
				__typename: "StockPortfolio"
			}
		}
	}
};

export const GetStockDataForOnePortfolioMock: MockedResponse = {
	request: {
		query: GetStockDataDocument,
		variables: {
			tickers: mockTickers,
			dataKeys: mockHeaders.map(({ dataKey }) => dataKey)
		}
	},
	result: {
		data: {
			stockData: mockData
		}
	}
};

export const GetOneStockPortfolioMocks: readonly MockedResponse[] = [
	GetOneStockPortfolioMock,
	GetStockDataForOnePortfolioMock
];
