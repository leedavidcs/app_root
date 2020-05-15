import { gql } from "@apollo/client";

export default gql`
	extend type Mutation {
		setUser: User
	}

	extend type Query {
		user: User
	}
`;
