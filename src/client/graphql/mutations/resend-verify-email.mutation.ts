import gql from "graphql-tag";

export const ResendVerifyEmail = gql`
	mutation ResendVerifyEmail {
		resendVerifyEmail {
			success
		}
	}
`;
