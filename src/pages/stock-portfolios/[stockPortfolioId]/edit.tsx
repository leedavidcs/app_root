import {
	GetOneStockPortfolioDocument,
	GetOneStockPortfolioQuery,
	GetOneStockPortfolioQueryResult,
	GetOneStockPortfolioQueryVariables,
	useGetOneStockPortfolioQuery
} from "@/client/graphql";
import { withAuth } from "@/client/hocs";
import { StockPortfolioHead } from "@/client/page-parts/stock-portfolios/[stockPortfolioId]";
import { StockPortfolioEdit } from "@/client/page-parts/stock-portfolios/[stockPortfolioId]/edit";
import { breakpoints, CustomTheme } from "@/client/themes";
import { StockPortfolioWhereUniqueInput } from "@prisma/client";
import HttpStatus from "http-status-codes";
import { NextPage } from "next";
import Error from "next/error";
import { NextRouter, useRouter } from "next/router";
import React, { useMemo } from "react";
import { createUseStyles } from "react-jss";

interface IInitialProps {
	errorCode?: number;
	errorTitle?: string;
}

const styles = (theme: CustomTheme) => ({
	root: {
		color: theme.onBackground
	},
	head: {
		marginBottom: 24
	},
	edit: {
		maxWidth: 1280,
		margin: "0 auto",

		[breakpoints.up("sm")]: {
			paddingLeft: 25,
			paddingRight: 25
		}
	}
});

const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);

const useStockPortfolio = (): GetOneStockPortfolioQueryResult => {
	const router: NextRouter = useRouter();

	const { stockPortfolioId } = router.query;

	const where = useMemo(
		(): StockPortfolioWhereUniqueInput => ({ id: stockPortfolioId as string }),
		[stockPortfolioId]
	);

	const result = useGetOneStockPortfolioQuery({ variables: { where } });

	return result;
};

const Page: NextPage<IInitialProps> = ({ errorCode, errorTitle }) => {
	const classes = useStyles();

	const { called, data, loading } = useStockPortfolio();

	if (errorCode) {
		return <Error statusCode={errorCode} title={errorTitle} />;
	}

	const stockPortfolio = data?.stockPortfolio;

	const notFound: boolean = called && !loading && !stockPortfolio;

	if (notFound) {
		return <Error statusCode={HttpStatus.NOT_FOUND} title="Resource was not found" />;
	}

	if (loading || !stockPortfolio) {
		return null;
	}

	return (
		<main className={classes.root}>
			<StockPortfolioHead
				className={classes.head}
				editing={true}
				stockPortfolio={stockPortfolio}
			/>
			<StockPortfolioEdit className={classes.edit} stockPortfolio={stockPortfolio} />
		</main>
	);
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
		return { errorCode: HttpStatus.NOT_FOUND, errorTitle: "Resource was not found" };
	}

	const isCreator: boolean = user?.id === stockPortfolio.user.id;

	if (!isCreator) {
		return { errorCode: HttpStatus.FORBIDDEN, errorTitle: "Access to resource is forbidden" };
	}

	return {};
};

export default withAuth()(Page);
