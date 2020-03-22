import {
	GetOneStockPortfolioDocument,
	GetOneStockPortfolioQuery,
	GetOneStockPortfolioQueryVariables
} from "@/client/graphql";
import { withAuth } from "@/client/hocs";
import HttpStatus from "http-status-codes";
import { NextPage } from "next";
import Error from "next/error";
import React from "react";

interface IInitialProps {
	errorCode?: number;
}

export const Page: NextPage<IInitialProps> = ({ errorCode }) => {
	if (errorCode) {
		return <Error statusCode={errorCode} />;
	}

	return <div>Stock portfolio edit page works~!</div>;
};

Page.getInitialProps = async ({ apolloClient, query, user }) => {
	const { stockPortfolioId } = query;

	const { data } = await apolloClient.query<
		GetOneStockPortfolioQuery,
		GetOneStockPortfolioQueryVariables
	>({
		query: GetOneStockPortfolioDocument,
		variables: {
			where: {
				id: stockPortfolioId as string
			}
		}
	});

	const stockPortfolio = data.stockPortfolio;

	if (!stockPortfolio) {
		return { errorCode: HttpStatus.NOT_FOUND };
	}

	const isCreator: boolean = user?.id === stockPortfolio.id;

	if (!isCreator) {
		return { errorCode: HttpStatus.FORBIDDEN };
	}

	return {};
};

export default withAuth()(Page);
