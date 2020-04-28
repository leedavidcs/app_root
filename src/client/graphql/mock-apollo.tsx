import { IClientState } from "@/client/graphql";
import { createCache } from "@/client/graphql/client";
import { mocks } from "@/client/graphql/mocks";
import { resolvers } from "@/client/graphql/resolvers";
import { MockedProvider } from "@apollo/react-testing";
import Faker from "faker";
import React, { FC, ReactElement, useMemo } from "react";

Faker.seed(1);

const MOCK_CACHE_STATE: IClientState = {
	modal: false,
	user: {
		id: Faker.random.uuid(),
		email: Faker.internet.email(),
		emailVerified: Faker.random.boolean(),
		username: Faker.name.firstName(),
		createdAt: Faker.date.past(),
		updatedAt: Faker.date.recent(),
		timezone: "America/Los_Angeles",
		__typename: "User"
	}
};

interface IProps {
	children: ReactElement;
}

export const MockApollo: FC<IProps> = ({ children }) => {
	const cache = useMemo(() => {
		const mockClient = createCache();

		mockClient.writeData<IClientState>({
			data: { ...MOCK_CACHE_STATE }
		});

		return mockClient;
	}, []);

	return (
		<MockedProvider mocks={mocks} addTypename={true} cache={cache} resolvers={resolvers}>
			{children}
		</MockedProvider>
	);
};
