import gql from "graphql-tag";

export const SetUser = gql`
	mutation SetUser($user: UserInput) {
		setUser(user: $user) @client {
			id
			email
			emailVerified
			username
		}
	}
`;
