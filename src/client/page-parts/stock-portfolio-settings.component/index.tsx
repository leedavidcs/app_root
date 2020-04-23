import { List } from "@/client/components";
import { StockPortfolio as _StockPortfolio } from "@/client/graphql";
import { NextRouter, useRouter } from "next/router";
import React, { FC } from "react";
import { useStyles } from "./styles";

type StockPortfolio = Pick<_StockPortfolio, "id">;

interface IProps {
	stockPortfolio: StockPortfolio;
}

export const StockPortfolioSettings: FC<IProps> = ({ stockPortfolio }) => {
	const classes = useStyles();

	const router: NextRouter = useRouter();

	return (
		<div className={classes.root}>
			<List divider="full" selectedItem={router.asPath}>
				<List.Item
					href={`/stock-portfolios/${stockPortfolio.id}/settings`}
					text="Options"
				/>
				<List.Item
					selected={router.asPath.includes("/webhooks")}
					href={`/stock-portfolios/${stockPortfolio.id}/settings/webhooks`}
					text="Webhooks"
				/>
			</List>
		</div>
	);
};
