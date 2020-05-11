import { InlineLink, Paper } from "@/client/components";
import {
	GetOneStockPortfolioQuery,
	GetUserDocument,
	Snapshot as _Snapshot,
	StockData,
	StockPortfolio as _StockPortfolio,
	useGetStockDataLazyQuery,
	useGetUserQuery,
	User,
	useSetUserMutation
} from "@/client/graphql";
import { Classes, NonIdealState, Spinner } from "@blueprintjs/core";
import { ApolloQueryResult } from "apollo-boost";
import classnames from "classnames";
import { format } from "date-fns";
import React, { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { StockPortfolioDisplayContext } from "./context";
import { CreatorActions } from "./creator-actions.component";
import { LatestDataGrid } from "./latest-data-grid.component";
import { PublicActions } from "./public-actions.component";
import { SnapshotDataGrid } from "./snapshot-data-grid.component";
import { useStyles } from "./styles";

type Snapshot = Pick<_Snapshot, "id" | "createdAt" | "data" | "headers" | "tickers">;
type StockPortfolio = Pick<_StockPortfolio, "id" | "headers" | "name" | "updatedAt"> & {
	latestSnapshot?: Maybe<Pick<Snapshot, "createdAt" | "data">>;
	stockData: Pick<StockData, "refreshCost">;
	user: Pick<User, "id" | "username">;
};

interface IProps {
	className?: string;
	onDelete?: () => void;
	onEdit?: () => void;
	refetch?: () => Promise<ApolloQueryResult<GetOneStockPortfolioQuery>>;
	stockPortfolio: StockPortfolio;
}

type UseLatestDataResult = [
	{
		called: boolean;
		data: readonly Record<string, any>[];
		date: Date | null;
		loading: boolean;
	},
	{
		refresh: () => void;
		setData: (data: readonly Record<string, any>[]) => void;
	}
];

const useIsCreator = ({ stockPortfolio }: IProps): boolean => {
	const { data } = useGetUserQuery();

	const isCreator: boolean = data?.user?.id === stockPortfolio.user.id;

	return isCreator;
};

const useLatestData = ({ refetch, stockPortfolio }: IProps): UseLatestDataResult => {
	const [data, setData] = useState<readonly Record<string, any>[]>([]);
	const [date, setDate] = useState<Date | null>(null);

	const [setUser] = useSetUserMutation({
		awaitRefetchQueries: true,
		refetchQueries: [{ query: GetUserDocument }]
	});

	const [getStockData, result] = useGetStockDataLazyQuery({
		fetchPolicy: "no-cache",
		onCompleted: () => {
			setUser();
			refetch?.();
		}
	});

	const refresh = useCallback(() => {
		getStockData({
			variables: {
				where: { stockPortfolioId: stockPortfolio.id }
			}
		});
	}, [getStockData, stockPortfolio.id]);

	useEffect(() => {
		const { latestSnapshot } = stockPortfolio;

		if (latestSnapshot) {
			setData(latestSnapshot.data);
			setDate(new Date(latestSnapshot.createdAt));
		}
	}, [stockPortfolio]);

	const { called, loading } = result;

	const states = useMemo(
		() => ({
			/** If data, was called historically. Set to true */
			called: called || data.length > 0,
			data,
			date,
			loading
		}),
		[called, data, date, loading]
	);
	const actions = useMemo(() => ({ refresh, setData }), [refresh]);

	return useMemo((): UseLatestDataResult => [states, actions], [actions, states]);
};

export const StockPortfolioDisplay: FC<IProps> = memo((props) => {
	const { className, stockPortfolio } = props;

	const classes = useStyles();

	const { updatedAt, user } = stockPortfolio;
	const createdBy: string = user.username;

	const [snapshot, setSnapshot] = useState<Maybe<Pick<_Snapshot, "id" | "createdAt">>>();

	const [dataStates, dataActions] = useLatestData(props);

	const isCreator: boolean = useIsCreator(props);

	const contextValue = useMemo(() => ({ snapshot, setSnapshot }), [snapshot]);

	return (
		<StockPortfolioDisplayContext.Provider value={contextValue}>
			<div className={classnames(Classes.DARK, classes.root, className)}>
				<div className={classes.btnContainer}>
					<PublicActions
						className={classes.publicActions}
						onRefresh={dataActions.refresh}
						stockPortfolio={stockPortfolio}
					/>
					{isCreator && <CreatorActions stockPortfolio={stockPortfolio} />}
				</div>
				{snapshot ? (
					<>
						<div className={classes.snapshotInfo}>
							<p>
								You are now in <InlineLink href="" text="Snapshot Mode" />.
							</p>
							<p>
								* Tickers and headers may be configured differently than your
								current stock-portfolio.
							</p>
						</div>
						<Paper className={classes.portfolioContainer}>
							<SnapshotDataGrid snapshot={snapshot} />
						</Paper>
					</>
				) : (
					<Paper className={classes.portfolioContainer}>
						{!dataStates.called ? (
							<NonIdealState
								icon="search"
								title="Data not yet requested"
								description={
									<p>
										To load new data, press the <strong>Refresh</strong>
										button above.
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
							<LatestDataGrid stockPortfolio={stockPortfolio} />
						)}
					</Paper>
				)}
				<div className={classes.portfolioFooter}>
					<p className={classes.createdBy}>Created By: {createdBy}</p>
					<p className={classes.lastUpdated}>
						Last updated: {format(new Date(updatedAt), "PPPppp")}
					</p>
				</div>
			</div>
		</StockPortfolioDisplayContext.Provider>
	);
});

StockPortfolioDisplay.displayName = "StockPortfolioDisplay";
