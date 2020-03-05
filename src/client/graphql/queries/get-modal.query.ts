import gql from "graphql-tag";

export const GetModal = gql`
	query GetModal {
		modal @client
	}
`;
