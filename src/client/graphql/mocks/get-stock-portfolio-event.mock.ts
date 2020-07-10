import {
	Day,
	GetStockPortfolioEventDocument,
	Recurrence,
	StockPortfolioEventType
} from "@/client/graphql/generated";
import { MockedResponse } from "@apollo/client/testing";
import Faker from "faker";

export const GetStockPortfolioEventMock: MockedResponse = {
	request: {
		query: GetStockPortfolioEventDocument
	},
	result: {
		data: {
			stockPortfolioEvent: {
				__typename: "StockPortfolioEvent",
				scheduledEventId: Faker.random.uuid(),
				type: StockPortfolioEventType.DataRetrieved,
				scheduledEvent: {
					__typename: "ScheduledEvent",
					id: Faker.random.uuid(),
					interval: null,
					recurrence: Recurrence.Weekly,
					days: [Day.Mon, Day.Tues],
					hour: 15,
					minute: 50
				},
				stockPortfolio: {
					__typename: "StockPortfolio",
					id: Faker.random.uuid()
				}
			}
		}
	}
};
