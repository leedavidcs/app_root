import { createApolloClient, createCache, mocks, resolvers } from "@/client/graphql";
import { MockedProvider } from "@apollo/react-testing";
import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import React, { FC, ReactElement } from "react";
import { ApolloProvider as RealProvider } from "react-apollo";

interface IProps {
	children: ReactElement;
	mockRequests?: boolean;
}

export const ApolloProvider: FC<IProps> = ({ children, mockRequests = true }) => {
	if (mockRequests) {
		const cache = createCache();

		return (
			<MockedProvider mocks={mocks} addTypename={true} cache={cache} resolvers={resolvers}>
				{children}
			</MockedProvider>
		);
	}

	const client: ApolloClient<NormalizedCacheObject> = createApolloClient();

	return <RealProvider client={client}>{children}</RealProvider>;
};
