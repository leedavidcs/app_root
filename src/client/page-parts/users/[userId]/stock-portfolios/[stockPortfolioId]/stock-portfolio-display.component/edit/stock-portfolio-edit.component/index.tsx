import { DataGrid, EditableText, IHeaderConfig, IHeaderOption, Paper } from "@/client/components";
import {
	GetOneStockPortfolioQuery,
	UpdateOneStockPortfolioMutationVariables,
	useGetDataKeyOptionsQuery
} from "@/client/graphql";
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
	id: string;
	headers: StockPortfolioHeaders;
	name: string;
	tickers: readonly string[];
}

type StockPortfolioHeaders = IProps["stockPortfolio"]["headers"];

type UseHeadersResult = [
	{ headers: StockPortfolioHeaders; gridHeaders: readonly IHeaderConfig[] },
	{ setGridHeaders: (gridHeaders: readonly IHeaderConfig[]) => void }
];

type UseDataResult = [
	{ data: readonly Record<string, any>[]; tickers: readonly string[] },
	{ addTicker: (ticker: string) => void; setData: (data: readonly Record<string, any>[]) => void }
];

const validationSchema = () => ({ name: string().required("Name is required").min(1) });

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
): UseHeadersResult => {
	const [headers, setHeaders] = useState<StockPortfolioHeaders>(stockPortfolio.headers);
	const [gridHeaders, _setGridHeaders] = useState<readonly IHeaderConfig[]>([
		{
			label: "ticker",
			value: "ticker",
			frozen: true,
			options: null,
			resizable: true,
			width: 100
		},
		...headers.map(({ name, dataKey, ...commonProps }) => ({
			label: name,
			value: dataKey,
			...commonProps,
			options
		}))
	]);

	/** Always maintain an update-request compatible version of headers to simplify the request */
	const setGridHeaders = useCallback((newGridHeaders: readonly IHeaderConfig[]) => {
		const newHeaders: StockPortfolioHeaders = newGridHeaders
			.filter(({ value }) => value !== "ticker")
			.map(({ label, value, options: _options, ...commonProps }) => ({
				name: label,
				dataKey: value,
				...commonProps
			}));

		setHeaders(newHeaders);
		_setGridHeaders(newGridHeaders);
	}, []);

	useEffect(() => {
		gridHeaders.forEach((gridHeader) => (gridHeader.options = options));

		_setGridHeaders(gridHeaders);
	}, [gridHeaders, options]);

	const result: UseHeadersResult = useMemo(() => {
		const states = { headers, gridHeaders };
		const actions = { setGridHeaders };

		return [states, actions];
	}, [gridHeaders, headers, setGridHeaders]);

	return result;
};

const useData = ({ stockPortfolio }: IProps): UseDataResult => {
	const [tickers, setTickers] = useState<readonly string[]>(stockPortfolio.tickers);
	const [data, _setData] = useState<readonly Record<string, any>[]>(
		tickers.map((ticker) => ({ ticker }))
	);

	const addTicker = useCallback(
		(newTicker: string) => {
			const newTickers: readonly string[] = [...tickers, newTicker];

			setTickers(newTickers);
			_setData(newTickers.map((ticker) => ({ ticker })));
		},
		[tickers]
	);

	const setData = useCallback((newData: readonly Record<string, any>[]) => {
		const newTickers: readonly string[] = newData
			.map(({ ticker }) => ticker)
			.filter((ticker) => !ticker);

		setTickers(newTickers);
		_setData(newData);
	}, []);

	const result: UseDataResult = useMemo(() => {
		const states = { tickers, data };
		const actions = { addTicker, setData };

		return [states, actions];
	}, [addTicker, data, setData, tickers]);

	return result;
};

const useFormSubmitHandler = (handleSubmit: FormContextValues<IFormData>["handleSubmit"]) => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const onFormSubmit = useCallback(
		handleSubmit((data: IFormData) => {
			const variables: UpdateOneStockPortfolioMutationVariables = data;

			console.log(variables);

			setErrorMessage("Not yet implemented");
		}),
		[handleSubmit, setErrorMessage]
	);

	return { errorMessage, onFormSubmit };
};

export const StockPortfolioEdit: FC<IProps> = memo((props) => {
	const { stockPortfolio } = props;

	const classes = useStyles();

	const { control, errors, handleSubmit, setValue } = useForm<IFormData>({ validationSchema });

	const { errorMessage, onFormSubmit } = useFormSubmitHandler(handleSubmit);

	const optionsResult = useOptions();
	const [headerStates, headerActions] = useHeaders(props, optionsResult.options);
	const [dataStates, dataActions] = useData(props);

	useEffect(() => {
		setValue("id", stockPortfolio.id);
		setValue("tickers", dataStates.tickers);
		setValue("headers", headerStates.headers);
	}, [dataStates.tickers, headerStates.headers, setValue, stockPortfolio.id]);

	const { name, updatedAt, user } = stockPortfolio;

	return (
		<div className={classnames(Classes.DARK, classes.root)}>
			<form onSubmit={onFormSubmit}>
				<div>
					<Actions onAddTicker={dataActions.addTicker} stockPortfolio={stockPortfolio} />
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
							data={dataStates.data}
							headers={headerStates.gridHeaders}
							onDataChange={dataActions.setData}
							onHeadersChange={headerActions.setGridHeaders}
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
