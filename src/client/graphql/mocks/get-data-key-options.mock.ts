import { GetDataKeyOptionsDocument } from "@/client/graphql/generated";
import { MockedResponse } from "@apollo/react-testing";
import Faker from "faker";
import { range } from "lodash";

Faker.seed(1);

const OPTIONS_COUNT = 10;

const mockDataKeyOptions = range(OPTIONS_COUNT).map(() => ({
	name: Faker.name.firstName(),
	dataKey: Faker.name.lastName(),
	description: Faker.lorem.paragraph(),
	provider: "IEX_CLOUD",
	__typename: "DataKeyOption"
}));

export const GetDataKeyOptionsMock: MockedResponse = {
	request: {
		query: GetDataKeyOptionsDocument
	},
	result: {
		data: {
			dataKeyOptions: mockDataKeyOptions
		}
	}
};
