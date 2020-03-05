import gql from "graphql-tag";

export const GetOneStockPortfolio = gql`
	query GetOneStockPortfolio($id: String) {
		stockPortfolio(where: { id: $id }) {
			id
			name
			headers {
				name
				dataKey
				width
				frozen
				resizable
			}
			tickers
			createdAt
			updatedAt
		}
	}
`;
