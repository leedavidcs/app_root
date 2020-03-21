import { StockPortfolioWhereUniqueInput } from "@/client/graphql";
import { withAuth } from "@/client/hocs";
import { StockPortfolioDisplay } from "@/client/page-parts/users/[userId]/stock-portfolios/[stockPortfolioId]";
import { CustomTheme } from "@/client/themes";
import { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import React, { useMemo } from "react";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		color: theme.onBackground
	}
});

const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);

const useStockPortfolioWhereArg = () => {
	const router: NextRouter = useRouter();

	const { stockPortfolioId } = router.query;

	const where = useMemo(
		(): StockPortfolioWhereUniqueInput => ({ id: stockPortfolioId as string }),
		[stockPortfolioId]
	);

	return where;
};

export const Page: NextPage = () => {
	const classes = useStyles();

	const where = useStockPortfolioWhereArg();

	return (
		<main className={classes.root}>
			<StockPortfolioDisplay where={where} />
		</main>
	);
};

export default withAuth()(Page);
