import gql from "graphql-tag";

export const GetUser = gql`
	query GetUser {
		user @client {
			id
			email
			emailVerified
			username
		}
	}
`;
