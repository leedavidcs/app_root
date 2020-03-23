import { DataGrid, IHeaderConfig, Paper } from "@/client/components";
import {
	GetOneStockPortfolioQuery,
	GetStockDataQueryVariables,
	useGetStockDataLazyQuery
} from "@/client/graphql";
import { useSetUser } from "@/client/hooks";
import { Button, ButtonGroup, Classes, NonIdealState } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { CreatorActions } from "./creator-actions.component";
import { useStyles } from "./styles";

interface IProps {
	loading: boolean;
	onDelete?: () => void;
	onEdit?: () => void;
	stockPortfolio: GetOneStockPortfolioQuery["stockPortfolio"];
}

type UseDataResult = [
	{ getData: () => void; setData: (data: readonly Record<string, any>[]) => void },
	{ data: readonly Record<string, any>[]; requested: boolean }
];

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
		...(stockPortfolio?.headers ?? []).map(({ name, dataKey, ...headerProps }) => ({
			label: name,
			value: dataKey,
			...headerProps,
			options: null
		}))
	]);

	return [headers, setHeaders];
};

const useData = (tickers: string[], headers: readonly IHeaderConfig[]): UseDataResult => {
	const [data, setData] = useState<readonly Record<string, any>[]>([]);
	const [getStockData, result] = useGetStockDataLazyQuery();

	const dataKeys = useMemo(() => headers.map(({ value }) => value), [headers]);

	const variables: GetStockDataQueryVariables = useMemo(() => ({ tickers, dataKeys }), [
		dataKeys,
		tickers
	]);

	const getData = useCallback(() => getStockData({ variables }), [getStockData, variables]);

	useEffect(() => {
		const stockData = result.data?.stockData;

		if (stockData) {
			setData(stockData);
		}
	}, [result.data]);

	const requested: boolean = result.called && !result.loading;

	return useMemo(
		() => [
			{ getData, setData },
			{ data, requested }
		],
		[data, getData, requested]
	);
};

const useIsCreator = ({ stockPortfolio }: IProps): boolean => {
	const [, { user }] = useSetUser();

	const isCreator = Boolean(user && stockPortfolio && user.id === stockPortfolio.user.id);

	return isCreator;
};

export const StockPortfolioDisplay: FC<IProps> = memo((props) => {
	const { loading, stockPortfolio } = props;

	const classes = useStyles();

	const tickers = stockPortfolio?.tickers ?? [];

	const [headers, setHeaders] = useStockPortfolioHeaders(props);
	const [dataActions, dataResult] = useData(tickers, headers);

	const isCreator: boolean = useIsCreator(props);

	if (loading || !stockPortfolio) {
		return <p>loading...</p>;
	}

	const data = dataResult.data;
	const { name, updatedAt, user } = stockPortfolio;
	const createdBy: string = user.username;

	const noDataAvailable: boolean = !tickers.length || !headers.length || !data.length;

	return (
		<div className={classnames(Classes.DARK, classes.root)}>
			<div className={classes.btnContainer}>
				<ButtonGroup className={classes.refreshAction}>
					<Button icon="refresh" onClick={dataActions.getData} text="Refresh" />
				</ButtonGroup>
				{isCreator && <CreatorActions stockPortfolio={stockPortfolio} />}
			</div>
			{name && <h2 className={classes.portfolioName}>{name}</h2>}
			<Paper className={classes.portfolioContainer}>
				{!dataResult.requested ? (
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
					<DataGrid
						data={data}
						headers={headers}
						onDataChange={dataActions.setData}
						onHeadersChange={setHeaders}
					/>
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
