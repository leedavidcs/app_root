import { DataGrid, EditableText, Paper } from "@/client/components";
import { GetOneStockPortfolioQuery } from "@/client/graphql";
import { getYupValidationResolver } from "@/client/utils";
import { Classes, NonIdealState, Spinner } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, memo, useMemo } from "react";
import { useForm } from "react-hook-form";
import { string } from "yup";
import { Actions } from "./actions.component";
import { useStyles } from "./styles";
import { IStockPortfolioEditData, useData } from "./use-data.hook.";
import { useFormSubmitHandler } from "./use-form-submit-handler.hook";
import { useHeaders } from "./use-headers.hook";
import { useOnRowContextMenu } from "./use-on-row-context-menu.hook";
import { useOptions } from "./use-options.hook";

export interface IStockPortfolioEditProps {
	stockPortfolio: NonNullable<GetOneStockPortfolioQuery["stockPortfolio"]>;
}

export interface IFormData {
	name: string;
}

const TypedDataGrid = DataGrid.ofType<IStockPortfolioEditData>();

const validationSchema = () => ({ name: string().min(1) });
const validationResolver = getYupValidationResolver<IFormData>(validationSchema);

export const StockPortfolioEdit: FC<IStockPortfolioEditProps> = memo((props) => {
	const { stockPortfolio } = props;

	const classes = useStyles();

	const { control, errors, handleSubmit } = useForm<IFormData>({
		validationResolver
	});
	const optionsResult = useOptions();
	const [headerStates, headerActions] = useHeaders(props, optionsResult.options);
	const [dataStates, dataActions] = useData(props);

	const values = useMemo(
		() => ({
			id: stockPortfolio.id,
			tickers: dataStates.tickers,
			headers: headerStates.headers
		}),
		[dataStates.tickers, headerStates.headers, stockPortfolio.id]
	);

	const onFormSubmit = useFormSubmitHandler(values);

	const onRowContextMenu = useOnRowContextMenu(dataActions);

	const { name, updatedAt, user } = stockPortfolio;

	return (
		<div className={classnames(Classes.DARK, classes.root)}>
			<form onSubmit={handleSubmit(onFormSubmit)}>
				<div>
					<Actions
						columnOptions={optionsResult.options}
						onAddTicker={dataActions.addTicker}
						onAddColumn={headerActions.addGridHeader}
						stockPortfolio={stockPortfolio}
					/>
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
						<TypedDataGrid
							data={dataStates.data}
							headers={headerStates.gridHeaders}
							onDataChange={dataActions.setData}
							onHeadersChange={headerActions.setGridHeaders}
							onRowContextMenu={onRowContextMenu}
						/>
					)}
				</Paper>
				<div className={classes.portfolioFooter}>
					<p className={classes.createdBy}>Created by: {user.username}</p>
					<p className={classes.lastUpdated}>Last updated: {updatedAt}</p>
				</div>
			</form>
		</div>
	);
});

StockPortfolioEdit.displayName = "StockPortfolioEdit";
