import { GetOneStockPortfolioQuery } from "@/client/graphql";
import { withStockPortfolioAuth } from "@/client/hocs";
import { StockPortfolioHead } from "@/client/page-parts/stock-portfolios/[stockPortfolioId]";
import { StockPortfolioEdit } from "@/client/page-parts/stock-portfolios/[stockPortfolioId]/edit";
import { breakpoints, CustomTheme } from "@/client/themes";
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

const Page: NextPage<IProps> = ({ stockPortfolio }) => {
	const classes = useStyles();

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

export default withStockPortfolioAuth()(Page);
