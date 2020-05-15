import { CreateStripeSetupIntentDocument } from "@/client/graphql/generated";
import { MockedResponse } from "@apollo/client/testing";
import Faker from "faker";

Faker.seed(1);

export const CreateStripeSetupIntentMock: MockedResponse = {
	request: {
		query: CreateStripeSetupIntentDocument
	},
	result: {
		data: {
			createStripeSetupIntent: {
				id: Faker.random.uuid(),
				client_secret: Faker.random.alphaNumeric(),
				__typename: "StripeSetupIntent"
			}
		}
	}
};
