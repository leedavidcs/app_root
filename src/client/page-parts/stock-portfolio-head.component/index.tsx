import { ResourcePath, Tabs } from "@/client/components";
import { GetOneStockPortfolioQuery, useGetUserQuery } from "@/client/graphql";
import classnames from "classnames";
import React, { FC } from "react";
import { useStyles } from "./styles";

type StockPortfolio = NonNullable<GetOneStockPortfolioQuery["stockPortfolio"]>;

type TabId = "data" | "settings";

interface IProps {
	className?: string;
	selectedTab?: TabId;
	stockPortfolio: StockPortfolio;
}

export const StockPortfolioHead: FC<IProps> = ({ className, selectedTab, stockPortfolio }) => {
	const classes = useStyles();

	const { data } = useGetUserQuery({ fetchPolicy: "cache-only" });
	const user = data?.user;

	if (!user) {
		return null;
	}

	const isOwner: boolean = user.id === stockPortfolio.user.id;

	return (
		<div className={classnames(classes.root, className)}>
			<div className={classes.detailsContainer}>
				<ResourcePath>
					<ResourcePath.Part
						href={`/users/${stockPortfolio.user.id}`}
						text={stockPortfolio.user.username}
					/>
					<ResourcePath.Part
						active={true}
						href={`/stock-portfolios/${stockPortfolio.id}`}
						text={stockPortfolio.name}
					/>
				</ResourcePath>
			</div>
			<Tabs className={classes.tabs} selectedTab={selectedTab}>
				<Tabs.Tab
					id="data"
					href={`/stock-portfolios/${stockPortfolio.id}`}
					icon="grid"
					text="Data"
				/>
				{isOwner && (
					<Tabs.Tab
						id="settings"
						href={`/stock-portfolios/${stockPortfolio.id}/settings`}
						icon="cog"
						text="Settings"
					/>
				)}
			</Tabs>
		</div>
	);
};
