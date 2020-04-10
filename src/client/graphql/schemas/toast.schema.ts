import gql from "graphql-tag";

export default gql`
	type Toast {
		message: String!
	}

	input ToastInput {
		message: String!
	}

	extend type Mutation {
		setToast(toasts: [ToastInput!]!): [Toast!]!
	}

	extend type Query {
		toast: [Toast!]!
	}
`;
