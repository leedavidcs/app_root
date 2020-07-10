import { useGetOneStockPortfolioQuery } from "@/client/graphql";
import { withApollo } from "@/client/hocs";
import { StockPortfolioDisplay, StockPortfolioHead } from "@/client/page-parts";
import { breakpoints, colors, CustomTheme } from "@/client/themes";
import classnames from "classnames";
import ms from "ms";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { createUseStyles } from "react-jss";

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

const Page: NextPage = () => {
	const classes = useStyles();

	const { query } = useRouter();

	const { stockPortfolioId } = query;

	const { data } = useGetOneStockPortfolioQuery({
		pollInterval: ms("2m"),
		variables: {
			where: { id: stockPortfolioId as string }
		}
	});

	const stockPortfolio = data?.stockPortfolio;

	if (!stockPortfolio) {
		return null;
	}

	return (
		<main className={classnames(classes.root)}>
			<div className={classes.head}>
				<StockPortfolioHead selectedTab="data" stockPortfolio={stockPortfolio} />
			</div>
			<StockPortfolioDisplay className={classes.display} stockPortfolio={stockPortfolio} />
		</main>
	);
};

export default withApollo({ ssr: false })(Page);
