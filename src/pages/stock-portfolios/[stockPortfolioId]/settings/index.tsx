import { Card } from "@/client/components";
import { StockPortfolioSettingsForm } from "@/client/forms";
import { GetOneStockPortfolioQuery } from "@/client/graphql";
import { withStockPortfolioAuth } from "@/client/hocs";
import { StockPortfolioHead, StockPortfolioSettings } from "@/client/page-parts";
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
			margin: "auto",
			maxWidth: 980
		}
	},
	container: {
		maxWidth: 980,
		margin: "0 auto",

		[breakpoints.up("sm")]: {
			display: "flex",
			alignItems: "flex-start",
			padding: "0 25px"
		}
	},
	content: {
		flexGrow: 1,
		marginLeft: 32
	},
	settingHeader: {
		marginTop: 0,
		marginBottom: 16,
		paddingBottom: 8,
		borderBottom: `1px solid ${colors.darkGray4}`
	}
});

const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);

const Page: NextPage<IProps> = ({ stockPortfolio }) => {
	const classes = useStyles();

	return (
		<main className={classes.root}>
			<div className={classes.head}>
				<StockPortfolioHead selectedTab="settings" stockPortfolio={stockPortfolio} />
			</div>
			<div className={classes.container}>
				<StockPortfolioSettings stockPortfolio={stockPortfolio} />
				<div className={classes.content}>
					<h2 className={classes.settingHeader}>Options</h2>
					<Card>
						<StockPortfolioSettingsForm stockPortfolio={stockPortfolio} />
					</Card>
				</div>
			</div>
		</main>
	);
};

export default withStockPortfolioAuth()(Page);
