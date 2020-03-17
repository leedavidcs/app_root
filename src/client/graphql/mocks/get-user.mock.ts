import { GetUserDocument } from "@/client/graphql/generated";
import { MockedResponse } from "@apollo/react-testing";
import Faker from "faker";

Faker.seed(1);

export const GetUserMock: MockedResponse = {
	request: {
		query: GetUserDocument
	},
	result: {
		data: {
			id: Faker.random.uuid(),
			email: Faker.internet.email(),
			emailVerified: Faker.random.boolean(),
			username: Faker.name.firstName(),
			__typename: "User"
		}
	}
};
