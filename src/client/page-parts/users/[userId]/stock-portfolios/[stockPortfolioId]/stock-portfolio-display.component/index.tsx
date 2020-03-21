import { DataGrid, IHeaderConfig, IHeaderOption, Paper } from "@/client/components";
import {
	DataKeyOption,
	GetOneStockPortfolioQuery,
	GetStockDataQueryVariables,
	useGetDataKeyOptionsQuery,
	useGetStockDataLazyQuery
} from "@/client/graphql";
import React, { FC, memo, useEffect, useMemo } from "react";
import { useStyles } from "./styles";

interface IProps {
	loading: boolean;
	stockPortfolio: GetOneStockPortfolioQuery["stockPortfolio"];
	withData?: boolean;
}

const useDataKeyOptions = () => {
	const { data } = useGetDataKeyOptionsQuery();

	const dataKeyOptions: readonly DataKeyOption[] = data?.dataKeyOptions || [];

	return dataKeyOptions;
};

const useStockPortfolioHeaders = ({ stockPortfolio }: IProps) => {
	const dataKeyOptions = useDataKeyOptions();

	const options: readonly IHeaderOption[] = useMemo(() => {
		return dataKeyOptions.map(({ name, dataKey }) => ({
			label: name,
			value: dataKey
		}));
	}, [dataKeyOptions]);

	const headers: readonly IHeaderConfig[] = useMemo(() => {
		return (
			stockPortfolio?.headers.map(({ name, dataKey, ...header }) => ({
				label: name,
				value: dataKey,
				...header,
				options
			})) ?? []
		);
	}, [options, stockPortfolio]);

	return headers;
};

const useData = ({ stockPortfolio, withData }: IProps): readonly Record<string, any>[] => {
	const [getStockData, { data }] = useGetStockDataLazyQuery();

	const headers = stockPortfolio?.headers || [];
	const tickers = stockPortfolio?.tickers || [];
	const dataKeys = useMemo(() => headers.map(({ dataKey }) => dataKey), [headers]);

	const variables: GetStockDataQueryVariables = useMemo(() => ({ tickers, dataKeys }), [
		dataKeys,
		tickers
	]);

	useEffect(() => {
		if (withData) {
			getStockData({ variables });
		}
	}, [getStockData, variables, withData]);

	const result: readonly Record<string, any>[] = data?.stockData || [];

	return result;
};

export const StockPortfolioDisplay: FC<IProps> = memo((props) => {
	const { loading, stockPortfolio } = props;

	const classes = useStyles();

	const headers: readonly IHeaderConfig[] = useStockPortfolioHeaders(props);
	const data: readonly Record<string, any>[] = useData(props);

	if (loading || !stockPortfolio) {
		return <p>loading...</p>;
	}

	const { name, updatedAt, user } = stockPortfolio;
	const createdBy: string = user.username;

	return (
		<div className={classes.root}>
			{name && <h2 className={classes.portfolioName}>{name}</h2>}
			<Paper className={classes.portfolioContainer}>
				<DataGrid data={data} headers={headers} />
			</Paper>
			<div className={classes.portfolioFooter}>
				<p className={classes.createdBy}>Created By: {createdBy}</p>
				<p className={classes.lastUpdated}>Last updated: {updatedAt}</p>
			</div>
		</div>
	);
});

StockPortfolioDisplay.displayName = "StockPortfolioDisplay";
