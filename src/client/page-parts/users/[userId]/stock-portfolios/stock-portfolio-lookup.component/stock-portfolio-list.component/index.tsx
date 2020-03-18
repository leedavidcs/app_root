import { IKebabMenuOption, KebabMenu, List, ListItem, ListItemText } from "@/client/components";
import {
	GetStockPortfoliosForPreviewQueryVariables,
	useDeleteStockPortfolioMutation,
	useGetStockPortfoliosForPreviewQuery
} from "@/client/graphql";
import { Classes } from "@blueprintjs/core";
import classnames from "classnames";
import { range } from "lodash";
import React, { FC, memo, useCallback } from "react";
import { useStyles } from "./styles";

const LOADING_ELEMENTS = 3;

interface IProps {
	className?: string;
	/** onClick listener, when a stock portfolio gets clicked on. Passes the id. */
	onClickOpen: (id: string) => void;
	/** Variables to invoke the stockPortfolios query */
	variables?: GetStockPortfoliosForPreviewQueryVariables;
}

const useClickDelete = (onCompleted: () => any) => {
	const onDeleteCompleted = useCallback(() => {
		onCompleted();
	}, [onCompleted]);

	const [deleteStockPortfolio] = useDeleteStockPortfolioMutation({
		onCompleted: onDeleteCompleted
	});

	const onClickDeleteOption = useCallback(
		(id: string) => () => {
			deleteStockPortfolio({ variables: { id } });
		},
		[deleteStockPortfolio]
	);

	return onClickDeleteOption;
};

export const StockPortfolioList: FC<IProps> = memo((props) => {
	const { className, onClickOpen: propsOnClickOpen, variables } = props;

	const classes = useStyles();

	const { data, loading, refetch } = useGetStockPortfoliosForPreviewQuery({ variables });

	const onClickDelete = useClickDelete(refetch);

	const onClickOpen = useCallback((id: string) => () => propsOnClickOpen(id), [propsOnClickOpen]);

	const kebabOptions = useCallback(
		(id: string): readonly IKebabMenuOption[] => [
			{ text: "Delete", onClick: onClickDelete(id) }
		],
		[onClickDelete]
	);

	if (loading || !data) {
		return (
			<List className={className} divider="full">
				{range(LOADING_ELEMENTS).map((__, i) => (
					<ListItem key={i}>
						<ListItemText
							primary={
								<div className={classnames(classes.loadName, Classes.SKELETON)} />
							}
							secondary={
								<div className={classnames(classes.loadDate, Classes.SKELETON)} />
							}
						/>
					</ListItem>
				))}
			</List>
		);
	}

	return (
		<List className={className} divider="full">
			{data.stockPortfolios.map(({ id, name, updatedAt }, i) => (
				<ListItem key={id} onClick={onClickOpen(id)} ripple={false} selected={false}>
					<ListItemText primary={name} secondary={`Updated at: ${updatedAt}`} />
					<KebabMenu options={kebabOptions(id)} />
				</ListItem>
			))}
		</List>
	);
});

StockPortfolioList.displayName = "StockPortfolioList";
