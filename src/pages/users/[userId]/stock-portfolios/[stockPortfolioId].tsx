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
import { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		maxWidth: 1280,
		margin: "0 auto",
		color: theme.onBackground
	},
	ownerActionsContainer: {
		display: "flex",
		justifyContent: "flex-end",
		marginTop: 60
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

	const { called, data, loading } = result;

	useEffect(() => {
		if (called && !loading && !data?.stockPortfolio) {
			router.push("/not-found");
		}
	}, [called, data, loading, router]);

	return result;
};

export const Page: NextPage = () => {
	const classes = useStyles();

	const { data, loading } = useStockPortfolio();

	const stockPortfolio = data?.stockPortfolio;

	return (
		<main className={classnames(Classes.DARK, classes.root)}>
			<StockPortfolioDisplay stockPortfolio={stockPortfolio} loading={loading} />
		</main>
	);
};

export default withAuth()(Page);
