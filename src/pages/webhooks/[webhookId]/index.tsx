import { UpsertWebhookForm } from "@/client/forms";
import { GetOneStockPortfolioQuery } from "@/client/graphql";
import { withStockPortfolioAuth } from "@/client/hocs";
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
		maxWidth: 800,
		margin: "0 auto",
		color: theme.onBackground
	}
});

const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);

const Page: NextPage<IProps> = ({ stockPortfolio }) => {
	const classes = useStyles();

	return (
		<main className={classes.root}>
			<UpsertWebhookForm stockPortfolioId={stockPortfolio.id} />
		</main>
	);
};

export default withStockPortfolioAuth()(Page);
