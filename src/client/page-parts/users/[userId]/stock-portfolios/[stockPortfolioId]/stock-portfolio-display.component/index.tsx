import { DataGrid, IHeaderConfig, Paper } from "@/client/components";
import {
	GetOneStockPortfolioQuery,
	GetStockDataQueryVariables,
	useGetStockDataLazyQuery
} from "@/client/graphql";
import { useSetUser } from "@/client/hooks";
import { Classes, NonIdealState, Spinner } from "@blueprintjs/core";
import classnames from "classnames";
import { format } from "date-fns";
import React, { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { CreatorActions } from "./creator-actions.component";
import { PublicActions } from "./public-actions.component";
import { useStyles } from "./styles";

interface IProps {
	onDelete?: () => void;
	onEdit?: () => void;
	stockPortfolio: NonNullable<GetOneStockPortfolioQuery["stockPortfolio"]>;
}

type UseDataResult = [
	{ called: boolean; data: readonly Record<string, any>[]; loading: boolean },
	{
		refresh: (variables: GetStockDataQueryVariables) => void;
		setData: (data: readonly Record<string, any>[]) => void;
	}
];

const tickerHeader: IHeaderConfig = {
	label: "ticker",
	value: "ticker",
	options: null,
	editable: false,
	frozen: true,
	resizable: true,
	width: 100
};

const useStockPortfolioHeaders = ({
	stockPortfolio
}: IProps): readonly [readonly IHeaderConfig[], (headers: readonly IHeaderConfig[]) => void] => {
	const [headers, setHeaders] = useState<readonly IHeaderConfig[]>(() => [
		tickerHeader,
		...stockPortfolio.headers.map(({ name, dataKey, frozen, resizable, width }) => ({
			label: name,
			value: dataKey,
			options: null,
			editable: false,
			frozen,
			resizable,
			width
		}))
	]);

	return [headers, setHeaders];
};

const useIsCreator = ({ stockPortfolio }: IProps): boolean => {
	const [, { user }] = useSetUser();

	const isCreator = user?.id === stockPortfolio.user.id;

	return isCreator;
};

const useData = (): UseDataResult => {
	const [data, setData] = useState<readonly Record<string, any>[]>([]);
	const [getStockData, result] = useGetStockDataLazyQuery({ fetchPolicy: "no-cache" });

	const refresh = useCallback(
		(variables: GetStockDataQueryVariables) => {
			getStockData({ variables });
		},
		[getStockData]
	);

	useEffect(() => {
		const stockData = result.data?.stockData?.data;

		if (stockData) {
			setData(stockData);
		}
	}, [result.data]);

	const { called, loading } = result;

	const states = useMemo(() => ({ called, data, loading }), [called, data, loading]);
	const actions = useMemo(() => ({ refresh, setData }), [refresh]);

	return useMemo((): UseDataResult => [states, actions], [actions, states]);
};

export const StockPortfolioDisplay: FC<IProps> = memo((props) => {
	const { stockPortfolio } = props;

	const classes = useStyles();

	const { name, tickers, updatedAt, user } = stockPortfolio;

	const [headers, setHeaders] = useStockPortfolioHeaders(props);
	const [dataStates, dataActions] = useData();

	const isCreator: boolean = useIsCreator(props);

	const data = dataStates.data;
	const createdBy: string = user.username;

	const noDataAvailable: boolean = !tickers.length || !headers.length || !data.length;

	return (
		<div className={classnames(Classes.DARK, classes.root)}>
			<div className={classes.btnContainer}>
				<PublicActions
					className={classes.publicActions}
					onRefresh={dataActions.refresh}
					stockPortfolio={stockPortfolio}
				/>
				{isCreator && <CreatorActions stockPortfolio={stockPortfolio} />}
			</div>
			{name && <h2 className={classes.portfolioName}>{name}</h2>}
			<Paper className={classes.portfolioContainer}>
				{!dataStates.called ? (
					<NonIdealState
						icon="search"
						title="Data not yet requested"
						description={
							<p>
								To load new data, press the <strong>Refresh</strong> button above.
							</p>
						}
					/>
				) : dataStates.loading ? (
					<NonIdealState
						icon={<Spinner />}
						title="Loading..."
						description={<p>Your data should be loaded shortly.</p>}
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
				<p className={classes.lastUpdated}>
					Last updated: {format(new Date(updatedAt), "PPPppp")}
				</p>
			</div>
		</div>
	);
});

StockPortfolioDisplay.displayName = "StockPortfolioDisplay";
