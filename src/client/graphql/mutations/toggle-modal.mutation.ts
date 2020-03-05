import gql from "graphql-tag";

export const ToggleModal = gql`
	mutation ToggleModal($force: Boolean) {
		toggleModal(force: $force) @client
	}
`;
