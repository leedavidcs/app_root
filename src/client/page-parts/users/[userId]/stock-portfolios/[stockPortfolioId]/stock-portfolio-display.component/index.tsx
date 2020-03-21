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
}

const useDataKeyOptions = () => {
	const { data } = useGetDataKeyOptionsQuery();

	const dataKeyOptions: readonly DataKeyOption[] = data?.dataKeyOptions || [];

	return dataKeyOptions;
};

const useStockPortfolioHeaders = ({ stockPortfolio }: IProps) => {
	const dataKeyOptions = useDataKeyOptions();

	const options: readonly IHeaderOption[] = useMemo(
		() =>
			dataKeyOptions.map(({ name, dataKey }) => ({
				label: name,
				value: dataKey
			})),
		[dataKeyOptions]
	);

	const headers: readonly IHeaderConfig[] =
		stockPortfolio?.headers.map(({ name, dataKey, ...header }) => ({
			label: name,
			value: dataKey,
			...header,
			options
		})) ?? [];

	return headers;
};

const useData = ({ stockPortfolio }: IProps): readonly Record<string, any>[] => {
	const [getStockData, { data }] = useGetStockDataLazyQuery();

	const headers = stockPortfolio?.headers || [];
	const tickers = stockPortfolio?.tickers || [];
	const dataKeys = useMemo(() => headers.map(({ dataKey }) => dataKey), [headers]);

	const variables: GetStockDataQueryVariables = useMemo(() => ({ tickers, dataKeys }), [
		dataKeys,
		tickers
	]);

	useEffect(() => getStockData({ variables }), [getStockData, variables]);

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
