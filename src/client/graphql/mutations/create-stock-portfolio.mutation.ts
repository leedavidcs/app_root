import gql from "graphql-tag";

export const CreateStockPortfolio = gql`
	mutation CreateStockPortfolio($name: String) {
		createOneStockPortfolio(data: { name: $name }) {
			id
			name
		}
	}
`;
