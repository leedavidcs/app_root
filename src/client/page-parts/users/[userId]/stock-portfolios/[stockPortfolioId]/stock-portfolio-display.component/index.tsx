import { DataGrid, IHeaderConfig, IHeaderOption, Paper } from "@/client/components";
import {
	DataKeyOption,
	GetOneStockPortfolioQuery,
	useGetDataKeyOptionsQuery
} from "@/client/graphql";
import React, { FC, memo, useMemo } from "react";
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

export const StockPortfolioDisplay: FC<IProps> = memo((props) => {
	const { loading, stockPortfolio } = props;

	const classes = useStyles();

	const headers: readonly IHeaderConfig[] = useStockPortfolioHeaders(props);

	if (loading || !stockPortfolio) {
		return <p>loading...</p>;
	}

	const data: readonly Record<string, any>[] = stockPortfolio.data ?? [];
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
