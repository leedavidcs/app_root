import { DataGrid, IHeaderConfig, IHeaderOption, Paper } from "@/client/components";
import {
	DataKeyOption,
	StockPortfolio,
	StockPortfolioWhereUniqueInput,
	useGetDataKeyOptionsQuery,
	useGetOneStockPortfolioQuery
} from "@/client/graphql";
import React, { FC, memo, useMemo } from "react";
import { useStyles } from "./styles";

interface IProps {
	where: StockPortfolioWhereUniqueInput;
}

const useDataKeyOptions = () => {
	const { data } = useGetDataKeyOptionsQuery();

	const dataKeyOptions: readonly DataKeyOption[] = data?.dataKeyOptions || [];

	return dataKeyOptions;
};

const useStockPortfolio = ({ where }: IProps) => {
	const { data } = useGetOneStockPortfolioQuery({ variables: { where } });

	const stockPortfolio: Maybe<Omit<StockPortfolio, "user">> = data?.stockPortfolio;

	return stockPortfolio;
};

const useStockPortfolioHeaders = (stockPortfolio: ReturnType<typeof useStockPortfolio>) => {
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
	const classes = useStyles();

	const stockPortfolio = useStockPortfolio(props);

	const data: readonly Record<string, any>[] = stockPortfolio?.data ?? [];
	const headers: readonly IHeaderConfig[] = useStockPortfolioHeaders(stockPortfolio);
	const name = stockPortfolio?.name;
	const updatedAt = stockPortfolio?.updatedAt;

	return (
		<div className={classes.root}>
			{name && <h2 className={classes.portfolioName}>{name}</h2>}
			<Paper className={classes.portfolioContainer}>
				<DataGrid data={data} headers={headers} />
			</Paper>
			{updatedAt && <p className={classes.lastUpdated}>Last updated: {updatedAt}</p>}
		</div>
	);
});

StockPortfolioDisplay.displayName = "StockPortfolioDisplay";
