import { GetOneStockPortfolioQuery } from "@/client/graphql";
import { withStockPortfolioAuth } from "@/client/hocs";
import { StockPortfolioEdit, StockPortfolioHead } from "@/client/page-parts";
import { breakpoints, colors, CustomTheme } from "@/client/themes";
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
		marginBottom: 24,
		borderBottom: `1px solid ${colors.darkGray4}`,

		"& > *": {
			maxWidth: 1280,
			margin: "auto"
		}
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
			<div className={classes.head}>
				<StockPortfolioHead editing={true} stockPortfolio={stockPortfolio} />
			</div>

			<StockPortfolioEdit className={classes.edit} stockPortfolio={stockPortfolio} />
		</main>
	);
};

export default withStockPortfolioAuth()(Page);
