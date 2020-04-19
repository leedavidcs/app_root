import {
	GetOneStockPortfolioQueryResult,
	StockPortfolioWhereUniqueInput,
	useGetOneStockPortfolioQuery
} from "@/client/graphql";
import { withAuth } from "@/client/hocs";
import { StockPortfolioDisplay } from "@/client/page-parts/users/[userId]/stock-portfolios/[stockPortfolioId]";
import { CustomTheme } from "@/client/themes";
import { Classes } from "@blueprintjs/core";
import classnames from "classnames";
import HttpStatus from "http-status-codes";
import { NextPage } from "next";
import Error from "next/error";
import { NextRouter, useRouter } from "next/router";
import React, { useMemo } from "react";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		maxWidth: 1280,
		margin: "0 auto",
		color: theme.onBackground
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

const Page: NextPage = () => {
	const classes = useStyles();

	const { called, data, loading } = useStockPortfolio();

	const notFound: boolean = called && !loading && !data;

	if (notFound) {
		return <Error statusCode={HttpStatus.NOT_FOUND} title="Resource was not found" />;
	}

	return (
		<main className={classnames(Classes.DARK, classes.root)}>
			{loading || !data?.stockPortfolio ? (
				<p>loading...</p>
			) : (
				<StockPortfolioDisplay stockPortfolio={data?.stockPortfolio} />
			)}
		</main>
	);
};

export default withAuth()(Page);
