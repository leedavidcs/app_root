import gql from "graphql-tag";

export const GetStockPortfoliosForPreview = gql`
	query GetStockPortfoliosForPreview(
		$first: Int
		$after: StockPortfolioWhereUniqueInput
		$skip: Int
		$where: StockPortfolioWhereInput
		$query: String
	) {
		stockPortfolios(first: $first, after: $after, skip: $skip, where: $where, query: $query) {
			id
			name
			updatedAt
		}
	}
`;
