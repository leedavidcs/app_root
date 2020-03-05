import gql from "graphql-tag";

export const DeleteStockPortfolio = gql`
	mutation DeleteStockPortfolio($id: String) {
		deleteOneStockPortfolio(where: { id: $id }) {
			id
			name
		}
	}
`;
