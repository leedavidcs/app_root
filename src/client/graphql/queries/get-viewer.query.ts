import gql from "graphql-tag";

export const GetViewer = gql`
	query GetViewer {
		viewer {
			id
			email
			emailVerified
			username
		}
	}
`;
