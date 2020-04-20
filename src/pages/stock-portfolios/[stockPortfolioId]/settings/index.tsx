import { GetOneStockPortfolioQuery } from "@/client/graphql";
import { withStockPortfolioAuth } from "@/client/hocs";
import { StockPortfolioHead } from "@/client/page-parts";
import { CustomTheme } from "@/client/themes";
import { NextPage } from "next";
import React from "react";
import { createUseStyles } from "react-jss";

type StockPortfolio = NonNullable<GetOneStockPortfolioQuery["stockPortfolio"]>;

interface IProps {
	stockPortfolio: StockPortfolio;
}

const styles = (theme: CustomTheme) => ({
	root: {
		color: theme.onBackground
	},
	head: {
		marginBottom: 24
	}
});

const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);

const Page: NextPage<IProps> = ({ stockPortfolio }) => {
	const classes = useStyles();

	return (
		<main className={classes.root}>
			<StockPortfolioHead stockPortfolio={stockPortfolio} />
		</main>
	);
};

export default withStockPortfolioAuth()(Page);
