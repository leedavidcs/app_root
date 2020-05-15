import { GetPriceBundlesDocument } from "@/client/graphql/generated";
import { MockedResponse } from "@apollo/client/testing";

export const GetPriceBundlesMock: MockedResponse = {
	request: {
		query: GetPriceBundlesDocument
	},
	result: {
		data: {
			priceBundles: [
				{
					id: 0,
					credits: 500,
					price: 4.99,
					__typename: "PriceBundle"
				},
				{
					id: 1,
					credits: 2200,
					price: 19.99,
					__typename: "PriceBundle"
				},
				{
					id: 2,
					credits: 6000,
					price: 49.99,
					__typename: "PriceBundle"
				},
				{
					id: 3,
					credits: 13000,
					price: 99.99,
					__typename: "PriceBundle"
				}
			]
		}
	}
};
