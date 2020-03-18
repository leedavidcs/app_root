import { withApollo } from "@/client/hocs";
import { useSetUser } from "@/client/hooks";
import { StockPortfolioLookup } from "@/client/page-parts/users/[userId]/stock-portfolios";
import { CustomTheme } from "@/client/themes";
import { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import React, { useCallback } from "react";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		color: theme.onBackground
	},
	lookupHeader: {
		fontSize: 24
	},
	lookup: {
		width: "100%"
	}
});

const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);

const Page: NextPage = () => {
	const [, { user }] = useSetUser();

	const classes = useStyles();

	const router: NextRouter = useRouter();

	const { userId } = router.query;

	const onClickOpen = useCallback(
		(stockPortfolioId: string) => {
			router.push(`/users/${userId}/stock-portfolios/${stockPortfolioId}`);
		},
		[router, userId]
	);

	const userDisplayName: string = user?.id === userId ? "My" : user?.username || "";

	return (
		<main className={classes.root}>
			<h3 className={classes.lookupHeader}>{userDisplayName} Stock Portfolios</h3>
			<StockPortfolioLookup
				className={classes.lookup}
				onClickOpen={onClickOpen}
				userId={userId.toString()}
			/>
		</main>
	);
};

export default withApollo({ ssr: false })(Page);
