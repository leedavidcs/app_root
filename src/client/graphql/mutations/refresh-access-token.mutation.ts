import gql from "graphql-tag";

export const RefreshAccessToken = gql`
	mutation RefreshAccessToken($input: RefreshAccessTokenInput!) {
		refreshAccessToken(input: $input) {
			token
			refreshToken
		}
	}
`;
