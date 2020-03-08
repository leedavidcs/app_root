import gql from "graphql-tag";

export const GetStockPortfolioCount = gql`
	query GetStockPortfolioCount($where: StockPortfolioWhereInput, $query: String) {
		stockPortfolioCount(where: $where, query: $query)
	}
`;
