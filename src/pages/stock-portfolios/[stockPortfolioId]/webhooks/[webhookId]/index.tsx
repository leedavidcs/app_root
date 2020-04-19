import { UpsertWebhookForm } from "@/client/forms";
import {
	GetOneStockPortfolioDocument,
	GetOneStockPortfolioQuery,
	GetOneStockPortfolioQueryVariables
} from "@/client/graphql";
import { withAuth } from "@/client/hocs";
import { CustomTheme } from "@/client/themes";
import HttpStatus from "http-status-codes";
import { NextPage } from "next";
import Error from "next/error";
import { NextRouter, useRouter } from "next/router";
import React from "react";
import { createUseStyles } from "react-jss";

interface IInitialProps {
	errorCode?: number;
	errorTitle?: string;
}

const styles = (theme: CustomTheme) => ({
	root: {
		maxWidth: 800,
		margin: "0 auto",
		color: theme.onBackground
	}
});

const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);

const Page: NextPage<IInitialProps> = ({ errorCode, errorTitle }) => {
	const classes = useStyles();

	const router: NextRouter = useRouter();

	if (errorCode) {
		return <Error statusCode={errorCode} title={errorTitle} />;
	}

	const { stockPortfolioId } = router.query;

	return (
		<main className={classes.root}>
			<UpsertWebhookForm stockPortfolioId={stockPortfolioId as string} />
		</main>
	);
};

Page.getInitialProps = async ({ apolloClient, query, user }) => {
	const { stockPortfolioId } = query;

	const { data } = await apolloClient.query<
		GetOneStockPortfolioQuery,
		GetOneStockPortfolioQueryVariables
	>({
		query: GetOneStockPortfolioDocument,
		variables: {
			where: {
				id: stockPortfolioId as string
			}
		}
	});

	const stockPortfolio = data.stockPortfolio;

	if (!stockPortfolio) {
		return { errorCode: HttpStatus.NOT_FOUND, errorTitle: "Resource was not found" };
	}

	const isCreator: boolean = user?.id === stockPortfolio.user.id;

	if (!isCreator) {
		return { errorCode: HttpStatus.FORBIDDEN, errorTitle: "Access to resource is forbidden" };
	}

	return {};
};

export default withAuth()(Page);
