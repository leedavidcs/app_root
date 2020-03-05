import gql from "graphql-tag";

export const LoginLocalUser = gql`
	mutation LoginLocalUser($input: LoginLocalUserInput!) {
		loginLocalUser(input: $input) {
			token
			refreshToken
		}
	}
`;
