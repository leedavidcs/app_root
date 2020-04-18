import { IKebabMenuOption, KebabMenu, List, ListItem } from "@/client/components";
import { GetManyStockPortfoliosQuery } from "@/client/graphql";
import { Classes } from "@blueprintjs/core";
import classnames from "classnames";
import { format } from "date-fns";
import { range } from "lodash";
import React, { FC, memo, useCallback } from "react";
import { useStyles } from "./styles";

const LOADING_ELEMENTS = 3;

interface IProps {
	className?: string;
	loading: boolean;
	/** onClick listener, when a stock portfolio gets clicked on. Passes the id. */
	onClickOpen: (id: string) => void;
	onClickDelete: (id: string) => void;
	stockPortfolios: Maybe<GetManyStockPortfoliosQuery["stockPortfolios"]>;
}

export const StockPortfolioList: FC<IProps> = memo(
	({
		className,
		loading,
		onClickDelete: _onClickDelete,
		onClickOpen: _onClickOpen,
		stockPortfolios
	}) => {
		const classes = useStyles();

		const onClickDelete = useCallback((id: string) => () => _onClickDelete(id), [
			_onClickDelete
		]);

		const onClickOpen = useCallback((id: string) => () => _onClickOpen(id), [_onClickOpen]);

		const kebabOptions = useCallback(
			(id: string): readonly IKebabMenuOption[] => [
				{ text: "Delete", onClick: onClickDelete(id) }
			],
			[onClickDelete]
		);

		if (loading || !stockPortfolios) {
			return (
				<List className={className} divider="full">
					{range(LOADING_ELEMENTS).map((__, i) => (
						<ListItem
							key={i}
							text={
								<div className={classnames(classes.loadName, Classes.SKELETON)} />
							}
							info={
								<div className={classnames(classes.loadDate, Classes.SKELETON)} />
							}
						/>
					))}
				</List>
			);
		}

		return (
			<List className={className} divider="full">
				{stockPortfolios.map(({ id, name, updatedAt }, i) => (
					<ListItem
						key={id}
						onClick={onClickOpen(id)}
						ripple={false}
						text={name}
						info={`Updated at: ${format(new Date(updatedAt), "PPPppp")}`}
					>
						<KebabMenu options={kebabOptions(id)} />
					</ListItem>
				))}
			</List>
		);
	}
);

StockPortfolioList.displayName = "StockPortfolioList";
