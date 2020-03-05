import gql from "graphql-tag";

export const RegisterLocalUser = gql`
	mutation RegisterLocalUser($input: RegisterLocalUserInput!) {
		registerLocalUser(input: $input) {
			success
			error
			user {
				id
				email
				emailVerified
				username
			}
		}
	}
`;
