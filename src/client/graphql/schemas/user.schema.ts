import gql from "graphql-tag";

export default gql`
	input UserInput {
		"The id of the user"
		id: ID!
		"The user's email"
		email: EmailAddress!
		"Whether the user verified their email address"
		emailVerified: Boolean!
		"The user's encoded password"
		username: String!
	}

	extend type Mutation {
		setUser(user: UserInput): User
	}

	extend type Query {
		user: User
	}
`;
