import { ResourcePath, Tabs } from "@/client/components";
import { GetOneStockPortfolioQuery, useGetUserQuery } from "@/client/graphql";
import classnames from "classnames";
import { NextRouter, useRouter } from "next/router";
import React, { FC } from "react";
import { useStyles } from "./styles";

type StockPortfolio = NonNullable<GetOneStockPortfolioQuery["stockPortfolio"]>;

interface IProps {
	className?: string;
	editing?: boolean;
	stockPortfolio: StockPortfolio;
}

export const StockPortfolioHead: FC<IProps> = ({ className, editing, stockPortfolio }) => {
	const classes = useStyles();

	const router: NextRouter = useRouter();

	const { data } = useGetUserQuery({ fetchPolicy: "cache-only" });
	const user = data?.user;

	if (!user) {
		return null;
	}

	const isOwner: boolean = user.id === stockPortfolio.user.id;

	return (
		<div className={classnames(classes.root, className)}>
			<div className={classes.detailsContainer}>
				<ResourcePath
					activePath={editing ? `/stock-portfolios/${stockPortfolio.id}` : router.asPath}
				>
					<ResourcePath.Part
						href={`/users/${stockPortfolio.user.id}`}
						text={stockPortfolio.user.username}
					/>
					<ResourcePath.Part
						href={`/stock-portfolios/${stockPortfolio.id}`}
						text={stockPortfolio.name}
					/>
				</ResourcePath>
			</div>
			<Tabs className={classes.tabs} selectedTab={router.asPath}>
				<Tabs.Tab href={`/stock-portfolios/${stockPortfolio.id}`} icon="grid" text="Data" />
				{isOwner && (
					<Tabs.Tab
						href={`/stock-portfolios/${stockPortfolio.id}/settings`}
						icon="cog"
						text="Settings"
					/>
				)}
			</Tabs>
		</div>
	);
};
