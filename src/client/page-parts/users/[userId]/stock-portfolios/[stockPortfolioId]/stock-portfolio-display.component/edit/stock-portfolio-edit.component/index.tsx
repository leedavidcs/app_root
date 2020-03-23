import { DataGrid, EditableText, IHeaderConfig, IHeaderOption, Paper } from "@/client/components";
import { GetOneStockPortfolioQuery, useGetDataKeyOptionsQuery } from "@/client/graphql";
import { Classes, NonIdealState, Spinner } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { FormContextValues, useForm } from "react-hook-form";
import { string } from "yup";
import { Actions } from "./actions.component";
import { useStyles } from "./styles";

interface IProps {
	stockPortfolio: NonNullable<GetOneStockPortfolioQuery["stockPortfolio"]>;
}

interface IFormData {
	name: string;
}

const validationSchema = ({ name }: IFormData) => ({
	name: string().required("Name is required").min(1)
});

const useOptions = (): { loaded: boolean; options: readonly IHeaderOption[] } => {
	const { called, data, loading } = useGetDataKeyOptionsQuery();

	const options: readonly IHeaderOption[] = useMemo(() => {
		return (data?.dataKeyOptions || []).map(({ name, dataKey }) => ({
			label: name,
			value: dataKey
		}));
	}, [data]);

	const loaded: boolean = called && !loading;

	return useMemo(() => ({ loaded, options }), [loaded, options]);
};

const useHeaders = (
	{ stockPortfolio }: IProps,
	options: readonly IHeaderOption[]
): [readonly IHeaderConfig[], (headers: readonly IHeaderConfig[]) => void] => {
	const [headers, setHeaders] = useState<readonly IHeaderConfig[]>([
		{
			label: "ticker",
			value: "ticker",
			frozen: true,
			options: null,
			resizable: true,
			width: 100
		},
		...(stockPortfolio?.headers || []).map((header) => {
			const { name, dataKey, ...headerProps } = JSON.parse(header);

			return {
				label: name,
				value: dataKey,
				...headerProps,
				options
			};
		})
	]);

	useEffect(() => {
		/**
		 * !HACK
		 * @description This results in the same header instance, so that an infinite render loop
		 * can be avoided.
		 * @author David Lee
		 * @date March 21, 2020
		 */
		headers.forEach((header) => (header.options = options));

		setHeaders(headers);
	}, [headers, options, setHeaders]);

	return [headers, setHeaders];
};

const useFormSubmitHandler = (handleSubmit: FormContextValues<IFormData>["handleSubmit"]) => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const onFormSubmit = useCallback(
		handleSubmit((data: IFormData) => {
			setErrorMessage("Not yet implemented");
		}),
		[handleSubmit, setErrorMessage]
	);

	return { errorMessage, onFormSubmit };
};

export const StockPortfolioEdit: FC<IProps> = memo((props) => {
	const { stockPortfolio } = props;

	const classes = useStyles();

	const [tickers, setTickers] = useState<readonly string[]>(stockPortfolio.tickers);
	const [data, setData] = useState<readonly Record<string, any>[]>(
		tickers.map((ticker) => ({ ticker }))
	);

	useEffect(() => setData(tickers.map((ticker) => ({ ticker }))), [tickers]);

	const { control, errors, handleSubmit } = useForm<IFormData>({ validationSchema });
	const { errorMessage, onFormSubmit } = useFormSubmitHandler(handleSubmit);

	const optionsResult = useOptions();
	const [headers, setHeaders] = useHeaders(props, optionsResult.options);
	const { name, updatedAt, user } = stockPortfolio;

	const onAddTicker = useCallback((newTicker: string) => setTickers([...tickers, newTicker]), [
		tickers
	]);

	return (
		<div className={classnames(Classes.DARK, classes.root)}>
			<form onSubmit={onFormSubmit}>
				<div>
					<Actions onAddTicker={onAddTicker} stockPortfolio={stockPortfolio} />
				</div>
				<h2 className={classes.portfolioName}>
					<EditableText
						control={control}
						placeholder={`Edit name: ${name}`}
						error={errors.name?.message}
						name="name"
					/>
				</h2>
				<Paper className={classes.portfolioContainer}>
					{!optionsResult.loaded ? (
						<NonIdealState icon={<Spinner />} title="Loading..." />
					) : (
						<DataGrid
							data={data}
							headers={headers}
							onDataChange={setData}
							onHeadersChange={setHeaders}
						/>
					)}
				</Paper>
				<div className={classes.portfolioFooter}>
					<p className={classes.createdBy}>Created by: {user.username}</p>
					<p className={classes.lastUpdated}>Last updated: {updatedAt}</p>
				</div>
			</form>
			{errorMessage && <p>{errorMessage}</p>}
		</div>
	);
});

StockPortfolioEdit.displayName = "StockPortfolioEdit";
