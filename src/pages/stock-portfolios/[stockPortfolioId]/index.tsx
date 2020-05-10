import { GetOneStockPortfolioQuery, useGetOneStockPortfolioQuery } from "@/client/graphql";
import { withStockPortfolioAuth } from "@/client/hocs";
import { StockPortfolioDisplay, StockPortfolioHead } from "@/client/page-parts";
import { breakpoints, colors, CustomTheme } from "@/client/themes";
import { Classes } from "@blueprintjs/core";
import classnames from "classnames";
import ms from "ms";
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

const Page: NextPage<IProps> = ({ stockPortfolio: propsStockPortfolio }) => {
	const classes = useStyles();

	const { data, refetch } = useGetOneStockPortfolioQuery({
		fetchPolicy: "no-cache",
		pollInterval: ms("2m"),
		variables: {
			where: { id: propsStockPortfolio.id }
		}
	});

	const polled = data?.stockPortfolio;

	const stockPortfolio = polled ?? propsStockPortfolio;

	return (
		<main className={classnames(Classes.DARK, classes.root)}>
			<div className={classes.head}>
				<StockPortfolioHead selectedTab="data" stockPortfolio={stockPortfolio} />
			</div>
			<StockPortfolioDisplay
				className={classes.display}
				refetch={refetch}
				stockPortfolio={stockPortfolio}
			/>
		</main>
	);
};

export default withStockPortfolioAuth({ requireOwner: false })(Page);
