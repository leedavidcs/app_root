import { GetOneStockPortfolioQuery } from "@/client/graphql";
import { withStockPortfolioAuth } from "@/client/hocs";
import {
	StockPortfolioDisplay,
	StockPortfolioHead
} from "@/client/page-parts/stock-portfolios/[stockPortfolioId]";
import { breakpoints, CustomTheme } from "@/client/themes";
import { Classes } from "@blueprintjs/core";
import classnames from "classnames";
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
	},
	display: {
		maxWidth: 1280,
		margin: "0 auto",

		[breakpoints.up("sm")]: {
			paddingLeft: 25,
			paddingRight: 25
		}
	}
});

const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);

const Page: NextPage<IProps> = ({ stockPortfolio }) => {
	const classes = useStyles();

	return (
		<main className={classnames(Classes.DARK, classes.root)}>
			<StockPortfolioHead className={classes.head} stockPortfolio={stockPortfolio} />
			<StockPortfolioDisplay className={classes.display} stockPortfolio={stockPortfolio} />
		</main>
	);
};

export default withStockPortfolioAuth({ requireOwner: false })(Page);
