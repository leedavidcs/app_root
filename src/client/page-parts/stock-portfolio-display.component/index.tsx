import { DataGrid, IHeaderConfig, Paper } from "@/client/components";
import {
	GetStockDataQueryVariables,
	GetUserDocument,
	Snapshot,
	StockData,
	StockPortfolio as _StockPortfolio,
	useGetStockDataLazyQuery,
	useGetUserQuery,
	User,
	useSetUserMutation
} from "@/client/graphql";
import { Classes, NonIdealState, Spinner } from "@blueprintjs/core";
import classnames from "classnames";
import { format, isAfter } from "date-fns";
import { minTime } from "date-fns/constants";
import React, { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { CreatorActions } from "./creator-actions.component";
import { PublicActions } from "./public-actions.component";
import { useStyles } from "./styles";

const MIN_DATE: Date = new Date(minTime);

type StockPortfolio = Pick<_StockPortfolio, "id" | "headers" | "name" | "tickers" | "updatedAt"> & {
	latestSnapshot?: Maybe<Pick<Snapshot, "createdAt" | "data">>;
	stockData: Pick<StockData, "refreshCost">;
	user: Pick<User, "id" | "username">;
};

interface IProps {
	className?: string;
	onDelete?: () => void;
	onEdit?: () => void;
	stockPortfolio: StockPortfolio;
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
	const getUserResult = useGetUserQuery();
	const user = getUserResult.data?.user ?? null;

	const isCreator = user?.id === stockPortfolio.user.id;

	return isCreator;
};

const useData = ({ stockPortfolio }: IProps): UseDataResult => {
	const [data, setData] = useState<readonly Record<string, any>[]>([]);
	const [lastRefresh, setLastRefresh] = useState<Date>(MIN_DATE);
	const [setUser] = useSetUserMutation({
		awaitRefetchQueries: true,
		refetchQueries: [{ query: GetUserDocument }]
	});

	const [getStockData, result] = useGetStockDataLazyQuery({
		fetchPolicy: "no-cache",
		onCompleted: () => {
			setLastRefresh(new Date());
			setUser();
		}
	});

	const refresh = useCallback(
		(variables: GetStockDataQueryVariables) => {
			getStockData({ variables });
		},
		[getStockData]
	);

	useEffect(() => {
		const { latestSnapshot } = stockPortfolio;

		const stockData = result.data?.stockData?.data;

		if (!latestSnapshot !== !stockData) {
			setData((latestSnapshot?.data ?? stockData) as readonly Record<string, any>[]);

			return;
		}

		const isRefreshRecent = isAfter(
			lastRefresh,
			new Date(latestSnapshot?.createdAt) ?? MIN_DATE
		);
		const latestData = isRefreshRecent ? stockData : latestSnapshot?.data;

		if (latestData) {
			setData(latestData);
		}
	}, [lastRefresh, result.data, stockPortfolio]);

	const { called, loading } = result;

	const states = useMemo(() => ({ called, data, loading }), [called, data, loading]);
	const actions = useMemo(() => ({ refresh, setData }), [refresh]);

	return useMemo((): UseDataResult => [states, actions], [actions, states]);
};

export const StockPortfolioDisplay: FC<IProps> = memo((props) => {
	const { className, stockPortfolio } = props;

	const classes = useStyles();

	const { tickers, updatedAt, user } = stockPortfolio;

	const [headers, setHeaders] = useStockPortfolioHeaders(props);
	const [dataStates, dataActions] = useData(props);

	const isCreator: boolean = useIsCreator(props);

	const data = dataStates.data;
	const createdBy: string = user.username;

	const noDataAvailable: boolean = !tickers.length || !headers.length || !data.length;

	return (
		<div className={classnames(Classes.DARK, classes.root, className)}>
			<div className={classes.btnContainer}>
				<PublicActions
					className={classes.publicActions}
					onRefresh={dataActions.refresh}
					stockPortfolio={stockPortfolio}
				/>
				{isCreator && <CreatorActions stockPortfolio={stockPortfolio} />}
			</div>
			<Paper className={classes.portfolioContainer}>
				{!noDataAvailable ? (
					<DataGrid
						data={data}
						headers={headers}
						onDataChange={dataActions.setData}
						onHeadersChange={setHeaders}
					/>
				) : !dataStates.called ? (
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
				) : (
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
