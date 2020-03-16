import { withAuth } from "@/client/hocs";
import { StockPortfolioLookup } from "@/client/page-parts/users/[userId]/stock-portfolios";
import { CustomTheme } from "@/client/themes";
import { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import React, { useCallback } from "react";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {}
});

const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);

const Page: NextPage = () => {
	useStyles();

	const router: NextRouter = useRouter();

	const { userId } = router.query;

	const onClickOpen = useCallback(
		(stockPortfolioId: string) => {
			router.push(`/users/${userId}/stock-portfolios/${stockPortfolioId}`);
		},
		[router, userId]
	);

	return (
		<div>
			<StockPortfolioLookup onClickOpen={onClickOpen} userId={userId.toString()} />
		</div>
	);
};

export default withAuth()(Page);
