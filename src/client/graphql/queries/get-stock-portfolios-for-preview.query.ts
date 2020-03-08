import gql from "graphql-tag";

export const GetStockPortfoliosForPreview = gql`
	query GetStockPortfoliosForPreview(
		$first: Int,
		$after: StockPortfolioWhereUniqueInput,
		$query: String
	) {
		stockPortfolios(first: $first, after: $after, query: $query) {
			id
			name
			updatedAt
		}
	}
`;
