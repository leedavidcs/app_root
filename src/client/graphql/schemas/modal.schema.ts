import { gql } from "@apollo/client";

export default gql`
	extend type Mutation {
		toggleModal(force: Boolean): Boolean!
	}

	extend type Query {
		modal: Boolean!
	}
`;
