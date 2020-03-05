import gql from "graphql-tag";

export default gql`
	extend type Mutation {
		toggleModal(force: Boolean): Boolean!
	}

	extend type Query {
		modal: Boolean!
	}
`;
