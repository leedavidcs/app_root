import gql from "graphql-tag";

export default gql`
	type Toast {
		intent: String
		message: String!
	}

	input ToastInput {
		intent: String
		message: String!
	}

	extend type Mutation {
		setToasts(toasts: [ToastInput!]!): [Toast!]!
	}

	extend type Query {
		toasts: [Toast!]!
	}
`;
