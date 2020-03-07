import { IKebabMenuOption, KebabMenu, List, ListItem, ListItemText } from "@/client/components";
import {
	DeleteStockPortfolio,
	GetStockPortfoliosForPreview,
	GetStockPortfoliosForPreviewVariables,
	Mutations,
	Queries
} from "@/client/graphql";
import { Classes } from "@blueprintjs/core";
import { range } from "lodash";
import React, { FC, useCallback } from "react";
import { useMutation, useQuery } from "react-apollo";

const LOADING_ELEMENTS = 3;

interface IProps {
	/** Variables to invoke the stockPortfolios query */
	variables?: GetStockPortfoliosForPreviewVariables;
	/** onClick listener, when a stock portfolio gets clicked on. Passes the id. */
	onClickOpen: (id: string) => void;
}

const useClickDeleteStockPortfolio = (onCompleted: () => any) => {
	const onDeleteCompleted = useCallback(() => {
		onCompleted();
	}, [onCompleted]);

	const [deleteStockPortfolio] = useMutation<DeleteStockPortfolio>(
		Mutations.DeleteStockPortfolio,
		{ onCompleted: onDeleteCompleted }
	);

	const onClickDeleteOption = useCallback(
		(id: string) => () => {
			deleteStockPortfolio({ variables: { id } });
		},
		[deleteStockPortfolio]
	);

	return onClickDeleteOption;
};

export const StockPortfolioList: FC<IProps> = ({ onClickOpen: propsOnClickOpen, variables }) => {
	const { data, loading, refetch } = useQuery<GetStockPortfoliosForPreview>(
		Queries.GetStockPortfoliosForPreview,
		{ variables }
	);

	const onClickDeleteStockPortfolio = useClickDeleteStockPortfolio(refetch);

	const onClickOpen = useCallback((id: string) => () => propsOnClickOpen(id), [propsOnClickOpen]);

	const kebabOptions = useCallback(
		(id: string): readonly IKebabMenuOption[] => [
			{ text: "Delete", onClick: onClickDeleteStockPortfolio(id) }
		],
		[onClickDeleteStockPortfolio]
	);

	if (loading || !data) {
		return (
			<List divider="full">
				{range(LOADING_ELEMENTS).map((__, i) => (
					<ListItem key={i}>
						<ListItemText
							primary={<div className={Classes.SKELETON} />}
							secondary={<div className={Classes.SKELETON} />}
						/>
					</ListItem>
				))}
			</List>
		);
	}

	return (
		<List divider="full">
			{data.stockPortfolios.map(({ id, name, updatedAt }, i) => (
				<ListItem key={id} onClick={onClickOpen(id)} ripple={false} selected={false}>
					<ListItemText primary={name} secondary={`Updated at: ${updatedAt}`} />
					<KebabMenu options={kebabOptions(id)} />
				</ListItem>
			))}
		</List>
	);
};
