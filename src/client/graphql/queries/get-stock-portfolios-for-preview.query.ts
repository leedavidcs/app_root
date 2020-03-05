import gql from "graphql-tag";

export const GetStockPortfoliosForPreview = gql`
	query GetStockPortfoliosForPreview($first: Int, $after: StockPortfolioWhereUniqueInput) {
		stockPortfolios(first: $first, after: $after) {
			id
			name
			updatedAt
		}
	}
`;
