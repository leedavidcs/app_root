import { DataGrid, IHeaderConfig, Paper } from "@/client/components";
import {
	GetOneStockPortfolioQuery,
	GetStockDataQueryResult,
	GetStockDataQueryVariables,
	useGetStockDataLazyQuery
} from "@/client/graphql";
import { useSetUser } from "@/client/hooks";
import { Button, ButtonGroup, Classes, NonIdealState } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, memo, useCallback, useMemo, useState } from "react";
import { CreatorActions } from "./creator-actions.component";
import { useStyles } from "./styles";

interface IProps {
	loading: boolean;
	onDelete?: () => void;
	onEdit?: () => void;
	stockPortfolio: GetOneStockPortfolioQuery["stockPortfolio"];
}

const baseHeaders: readonly IHeaderConfig[] = [
	{
		label: "ticker",
		value: "ticker",
		options: null,
		frozen: true,
		resizable: true,
		width: 100
	}
];

const useStockPortfolioHeaders = ({
	stockPortfolio
}: IProps): readonly [readonly IHeaderConfig[], (headers: readonly IHeaderConfig[]) => void] => {
	const [headers, setHeaders] = useState<readonly IHeaderConfig[]>([
		...baseHeaders,
		...(stockPortfolio?.headers.map(({ name, dataKey, ...header }) => ({
			label: name,
			value: dataKey,
			...header,
			options: null
		})) ?? [])
	]);

	return [headers, setHeaders];
};

const useData = ({ stockPortfolio }: IProps): [() => void, GetStockDataQueryResult] => {
	const [getStockData, result] = useGetStockDataLazyQuery();

	const headers = stockPortfolio?.headers || [];
	const tickers = stockPortfolio?.tickers || [];
	const dataKeys = useMemo(() => headers.map(({ dataKey }) => dataKey), [headers]);

	const variables: GetStockDataQueryVariables = useMemo(() => ({ tickers, dataKeys }), [
		dataKeys,
		tickers
	]);

	const getData = useCallback(() => getStockData({ variables }), [getStockData, variables]);

	return [getData, result];
};

const useIsCreator = ({ stockPortfolio }: IProps): boolean => {
	const [, { user }] = useSetUser();

	const isCreator = Boolean(user && stockPortfolio && user.id === stockPortfolio.user.id);

	return isCreator;
};

export const StockPortfolioDisplay: FC<IProps> = memo((props) => {
	const { loading, stockPortfolio } = props;

	const classes = useStyles();

	const [headers, setHeaders] = useStockPortfolioHeaders(props);
	const [getData, dataResult] = useData(props);

	const isCreator: boolean = useIsCreator(props);

	if (loading || !stockPortfolio) {
		return <p>loading...</p>;
	}

	const data = dataResult.data?.stockData ?? [];
	const { name, tickers, updatedAt, user } = stockPortfolio;
	const createdBy: string = user.username;

	const dataNotRequested: boolean = !dataResult.called || dataResult.loading;
	const noDataAvailable: boolean = !tickers.length || !headers.length || !data.length;

	return (
		<div className={classnames(Classes.DARK, classes.root)}>
			<div className={classes.btnContainer}>
				{isCreator && (
					<CreatorActions
						className={classes.creatorActions}
						stockPortfolio={stockPortfolio}
					/>
				)}
				<ButtonGroup>
					<Button icon="refresh" onClick={getData} text="Refresh" />
				</ButtonGroup>
			</div>
			{name && <h2 className={classes.portfolioName}>{name}</h2>}
			<Paper className={classes.portfolioContainer}>
				{dataNotRequested ? (
					<NonIdealState
						icon="search"
						title="Data not yet requested"
						description={
							<p>
								To load new data, press the <strong>Refresh</strong> button above.
							</p>
						}
					/>
				) : noDataAvailable ? (
					<NonIdealState
						icon="search"
						title="No data available"
						description={
							<>
								<p>This portfolio has no data to display.</p>
								<p>Tickers or headers may not be configured for this portfolio.</p>
							</>
						}
					/>
				) : (
					<DataGrid data={data} headers={headers} onHeadersChange={setHeaders} />
				)}
			</Paper>
			<div className={classes.portfolioFooter}>
				<p className={classes.createdBy}>Created By: {createdBy}</p>
				<p className={classes.lastUpdated}>Last updated: {updatedAt}</p>
			</div>
		</div>
	);
});

StockPortfolioDisplay.displayName = "StockPortfolioDisplay";
