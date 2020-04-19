import { IKebabMenuOption, KebabMenu, List, ListItem } from "@/client/components";
import { GetManyStockPortfoliosQuery, useDeleteStockPortfolioMutation } from "@/client/graphql";
import { useToast } from "@/client/hooks";
import { Classes } from "@blueprintjs/core";
import classnames from "classnames";
import { format } from "date-fns";
import { range } from "lodash";
import React, { FC, memo, useCallback } from "react";
import { useStyles } from "./styles";

const LOADING_ELEMENTS = 3;

type StockPortfolio = GetManyStockPortfoliosQuery["stockPortfolios"][number];

interface IProps {
	className?: string;
	loading: boolean;
	onDelete?: () => void;
	stockPortfolios: Maybe<readonly StockPortfolio[]>;
}

const useOnClickDelete = (props: IProps) => {
	const toaster = useToast();

	const [deleteStockPortfolio] = useDeleteStockPortfolioMutation({
		onCompleted: props.onDelete
	});

	return useCallback(
		({ id, name }: StockPortfolio) => async () => {
			await deleteStockPortfolio({ variables: { id } });

			toaster.show({
				intent: "success",
				message: `Deleted portfolio: ${name}`
			});
		},
		[deleteStockPortfolio, toaster]
	);
};

export const StockPortfolioList: FC<IProps> = memo((props) => {
	const { className, loading, stockPortfolios } = props;

	const classes = useStyles();

	const onClickDelete = useOnClickDelete(props);

	const kebabOptions = useCallback(
		(stockPortfolio: StockPortfolio): readonly IKebabMenuOption[] => [
			{ text: "Delete", onClick: onClickDelete(stockPortfolio) }
		],
		[onClickDelete]
	);

	if (loading || !stockPortfolios) {
		return (
			<List className={className} divider="full">
				{range(LOADING_ELEMENTS).map((__, i) => (
					<ListItem
						key={i}
						text={<div className={classnames(classes.loadName, Classes.SKELETON)} />}
						info={<div className={classnames(classes.loadDate, Classes.SKELETON)} />}
					/>
				))}
			</List>
		);
	}

	return (
		<List className={className} divider="full">
			{stockPortfolios.map((stockPortfolio) => {
				const { id, name, updatedAt } = stockPortfolio;

				return (
					<ListItem
						key={id}
						href={`/stock-portfolios/${id}`}
						ripple={false}
						text={name}
						info={`Updated at: ${format(new Date(updatedAt), "PPPppp")}`}
					>
						<KebabMenu options={kebabOptions(stockPortfolio)} />
					</ListItem>
				);
			})}
		</List>
	);
});

StockPortfolioList.displayName = "StockPortfolioList";
