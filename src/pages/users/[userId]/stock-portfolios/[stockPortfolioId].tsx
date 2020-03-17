import { GetOneStockPortfolioDocument, GetOneStockPortfolioQuery } from "@/client/graphql";
import { withAuth } from "@/client/hocs";
import { NextPage } from "next";
import React from "react";

export const Page: NextPage = () => {
	return <div>Stock portfolio page works~!</div>;
};

Page.getInitialProps = async ({ apolloClient, query }) => {
	const { stockPortfolioId } = query;

	await apolloClient.query<GetOneStockPortfolioQuery>({
		query: GetOneStockPortfolioDocument,
		variables: { id: stockPortfolioId }
	});

	return {};
};

export default withAuth()(Page);
