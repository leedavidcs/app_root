import {
	GetOneStockPortfolioDocument,
	GetOneStockPortfolioQuery,
	GetOneStockPortfolioQueryVariables
} from "@/client/graphql";
import HttpStatus from "http-status-codes";
import { NextPage, NextPageContext } from "next";
import ErrorPage from "next/error";
import React from "react";
import { withAuth } from "./with-auth.hoc";

type StockPortfolio = NonNullable<GetOneStockPortfolioQuery["stockPortfolio"]>;

interface IPageProps {
	stockPortfolio: StockPortfolio;
	[key: string]: any;
}

interface IInitialProps {
	errorCode?: number;
	errorTitle?: string;
	stockPortfolio: StockPortfolio;
}

/**
 * !important - Route query must have [stockPortfolioId]
 *
 * @description Requires that a user is authenticated, and that the user is an owner of the
 *     stock-portfolio.
 * @author David Lee
 * @date April 20, 2020
 */
export const withStockPortfolioAuth = <P extends IPageProps, IP = any>() => (
	PageComponent: NextPage<P, IP>
) => {
	const AuthedPage: NextPage<P & IInitialProps, any> = (props) => {
		const { errorCode, errorTitle, stockPortfolio } = props;

		if (errorCode) {
			return <ErrorPage statusCode={errorCode} title={errorTitle} />;
		}

		return <PageComponent {...props} stockPortfolio={stockPortfolio} />;
	};

	AuthedPage.getInitialProps = async (ctx: NextPageContext) => {
		const { apolloClient, query, user } = ctx;

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

		const stockPortfolio: Maybe<StockPortfolio> = data.stockPortfolio;

		if (!stockPortfolio) {
			return { errorCode: HttpStatus.NOT_FOUND, errorTitle: "Resource was not found" };
		}

		const isCreator: boolean = user?.id === stockPortfolio.user.id;

		if (!isCreator) {
			return {
				errorCode: HttpStatus.FORBIDDEN,
				errorTitle: "Access to resource is forbidden"
			};
		}

		const pageProps = await PageComponent.getInitialProps?.(ctx);

		return { ...pageProps, stockPortfolio };
	};

	return withAuth<any>()(AuthedPage);
};
