import { GetFeaturePricingDocument } from "@/client/graphql/generated";
import { MockedResponse } from "@apollo/client/testing";
import Faker from "faker";

Faker.seed(1);

export const GetFeaturePricingMock: MockedResponse = {
	request: {
		query: GetFeaturePricingDocument
	},
	result: {
		data: {
			featurePricing: {
				__typename: "FeaturePricing",
				snapshot: {
					__typename: "FeaturePricingConfig",
					price: 10
				}
			}
		}
	}
};
