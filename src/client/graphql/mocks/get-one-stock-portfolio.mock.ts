import { GetOneStockPortfolioDocument } from "@/client/graphql/generated";
import { MockedResponse } from "@apollo/react-testing";
import Faker from "faker";
import { range, uniqBy } from "lodash";

Faker.seed(1);

const HEADERS_COUNT = 20;
const TICKERS_COUNT = 50;

const mockHeaders = range(HEADERS_COUNT).map(() => ({
	name: Faker.name.firstName(),
	dataKey: Faker.name.lastName(),
	width: Faker.random.number({ min: 50, max: 100 }),
	frozen: false,
	resizable: true,
	__typename: "StockPortfolioHeader"
}));

const uniqueMockHeaders = uniqBy(mockHeaders, "name");

const mockTickers = range(TICKERS_COUNT).map(() => Faker.name.findName());

const mockData = mockTickers.map(() => {
	const headerKeys: readonly string[] = uniqueMockHeaders.map(({ dataKey }) => dataKey);

	return headerKeys.reduce<Record<string, number>>(
		(acc, key) => ({
			...acc,
			[key]: Faker.random.number({ min: -100, max: 100 })
		}),
		{}
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
					id: Faker.random.uuid(),
					username: Faker.name.findName(),
					__typename: "User"
				},
				data: mockData,
				__typename: "StockPortfolio"
			}
		}
	}
};
