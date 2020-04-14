import gql from "graphql-tag";

export default gql`
	extend type Mutation {
		setUser: User
	}

	extend type Query {
		user: User
	}
`;
