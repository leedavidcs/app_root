import { DataGrid, EditableText, IHeaderConfig, IHeaderOption, Paper } from "@/client/components";
import { GetOneStockPortfolioQuery, useGetDataKeyOptionsQuery } from "@/client/graphql";
import { Button, ButtonGroup } from "@blueprintjs/core";
import React, { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { FormContextValues, useForm } from "react-hook-form";
import { string } from "yup";
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

const useOptions = (): readonly IHeaderOption[] => {
	const { data } = useGetDataKeyOptionsQuery();

	const options: readonly IHeaderOption[] = useMemo(() => {
		return (data?.dataKeyOptions || []).map(({ name, dataKey }) => ({
			label: name,
			value: dataKey
		}));
	}, [data]);

	return options;
};

const useHeaders = ({
	stockPortfolio
}: IProps): [readonly IHeaderConfig[], (headers: readonly IHeaderConfig[]) => void] => {
	const options = useOptions();

	const [headers, setHeaders] = useState<readonly IHeaderConfig[]>([
		{
			label: "tickers",
			value: "tickers",
			frozen: true,
			options: null,
			resizable: true,
			width: 100
		},
		...(stockPortfolio?.headers || []).map(({ name, dataKey, ...header }) => ({
			label: name,
			value: dataKey,
			...header,
			options
		}))
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
			console.log(data);

			setErrorMessage("Not yet implemented");
		}),
		[handleSubmit, setErrorMessage]
	);

	return { errorMessage, onFormSubmit };
};

export const StockPortfolioEdit: FC<IProps> = memo((props) => {
	const { stockPortfolio } = props;

	const classes = useStyles();

	const { control, errors, handleSubmit } = useForm<IFormData>({ validationSchema });

	const { errorMessage, onFormSubmit } = useFormSubmitHandler(handleSubmit);

	const [headers, setHeaders] = useHeaders(props);

	const { name, tickers, updatedAt, user } = stockPortfolio;

	const data: readonly Record<string, any>[] = useMemo(
		() => tickers.map((ticker) => ({ ticker })),
		[tickers]
	);

	return (
		<div className={classes.root}>
			<form onSubmit={onFormSubmit}>
				<h2>
					<EditableText
						control={control}
						defaultValue={name}
						error={errors.name?.message}
					/>
				</h2>
				<Paper>
					<DataGrid data={data} headers={headers} onHeadersChange={setHeaders} />
				</Paper>
				<div>
					<p className={classes.createdBy}>Created by: {user.username}</p>
					<p className={classes.lastUpdated}>Last updated: {updatedAt}</p>
				</div>
				<div>
					<ButtonGroup>
						<Button intent="primary" text="Save" type="submit" />
					</ButtonGroup>
				</div>
			</form>
			{errorMessage && <p>{errorMessage}</p>}
		</div>
	);
});

StockPortfolioEdit.displayName = "StockPortfolioEdit";
