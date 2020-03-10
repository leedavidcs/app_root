import { IPaginationProps, Pagination } from "@/client/components";
import {
	CreateStockPortfolio,
	GetStockPortfolioCount,
	GetStockPortfoliosForPreviewVariables,
	Mutations,
	Queries
} from "@/client/graphql";
import { Button, Classes } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { StockPortfolioFilter } from "./stock-portfolio-filter.component";
import { StockPortfolioList } from "./stock-portfolio-list.component";
import { useStyles } from "./styles";

const DEFAULT_PAGINATION_FIRST = 10;

interface IProps {
	onClickOpen: (id: string) => void;
}

const useCount = (filters: GetStockPortfoliosForPreviewVariables): number => {
	const { data } = useQuery<GetStockPortfolioCount>(Queries.GetStockPortfolioCount, {
		variables: filters
	});

	const count: number = data?.stockPortfolioCount || 0;

	return count;
};

const useOnPage = (
	filters: GetStockPortfoliosForPreviewVariables
): [IPaginationProps, (value: IPaginationProps) => void] => {
	const count: number = useCount(filters);
	const [first, setFirst] = useState<number>(DEFAULT_PAGINATION_FIRST);
	const [skip, setSkip] = useState<number>(0);

	const pagination: IPaginationProps = { count, first, skip };

	const onPage = useCallback(
		(value: IPaginationProps) => {
			setFirst(value.first);
			setSkip(value.skip);
		},
		[setFirst, setSkip]
	);

	return [pagination, onPage];
};

const useOnClickNew = ({ onClickOpen }: IProps) => {
	const onCompleted = useCallback(
		(data: CreateStockPortfolio) => {
			const { id } = data.createOneStockPortfolio;

			onClickOpen(id);
		},
		[onClickOpen]
	);

	const [createStockPortfolio] = useMutation<CreateStockPortfolio>(
		Mutations.CreateStockPortfolio,
		{ onCompleted }
	);

	return useCallback(() => {
		createStockPortfolio();
	}, [createStockPortfolio]);
};

export const StockPortfolioLookup: FC<IProps> = (props) => {
	const { onClickOpen } = props;

	const classes = useStyles();

	const [filters, setFilters] = useState<GetStockPortfoliosForPreviewVariables>({});
	const [pagination, onPage] = useOnPage(filters);

	const variables: GetStockPortfoliosForPreviewVariables = useMemo(
		() => ({
			...filters,
			first: pagination.first,
			skip: pagination.skip
		}),
		[filters, pagination]
	);

	const onClickNew = useOnClickNew(props);

	return (
		<div className={classnames(Classes.DARK, classes.root)}>
			<StockPortfolioFilter variables={filters} onChange={setFilters} />
			<div className={classes.resultsContainer}>
				<div className={classes.createNewContainer}>
					<Button intent="primary" onClick={onClickNew} text="Create new portfolio" />
				</div>
				<StockPortfolioList
					className={classes.results}
					onClickOpen={onClickOpen}
					variables={variables}
				/>
			</div>
			<Pagination
				className={classes.pagination}
				{...pagination}
				onPage={onPage}
				showLimitConfig={true}
			/>
		</div>
	);
};
