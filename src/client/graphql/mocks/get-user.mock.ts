import * as Queries from "@/client/graphql/queries";
import { MockedResponse } from "@apollo/react-testing";
import Faker from "faker";

Faker.seed(1);

export const GetUserMock: MockedResponse = {
	request: {
		query: Queries.GetUser
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
