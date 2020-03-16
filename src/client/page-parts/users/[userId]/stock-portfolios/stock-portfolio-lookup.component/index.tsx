import { IPaginationProps, Pagination } from "@/client/components";
import {
	CreateStockPortfolio,
	CreateStockPortfolioVariables,
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
	className?: string;
	onClickOpen: (id: string) => void;
	userId?: string;
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

	const pagination: IPaginationProps = useMemo(() => ({ count, first, skip }), [
		count,
		first,
		skip
	]);

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

	const [createStockPortfolio] = useMutation<CreateStockPortfolio, CreateStockPortfolioVariables>(
		Mutations.CreateStockPortfolio,
		{ onCompleted }
	);

	return useCallback(() => {
		createStockPortfolio({
			variables: { name: "New_Portfolio" }
		});
	}, [createStockPortfolio]);
};

export const StockPortfolioLookup: FC<IProps> = (props) => {
	const { className, onClickOpen, userId } = props;

	const classes = useStyles();

	const [filters, setFilters] = useState<GetStockPortfoliosForPreviewVariables>({
		where: {
			user: { id: { equals: userId } }
		}
	});
	const [lastFilters, setLastFilters] = useState<GetStockPortfoliosForPreviewVariables>(filters);
	const [pagination, onPage] = useOnPage(filters);

	const onClickNew = useOnClickNew(props);

	const onSubmitFilters = useCallback(
		(value: GetStockPortfoliosForPreviewVariables) => setLastFilters({ ...value }),
		[setLastFilters]
	);

	const variables = useMemo(
		(): GetStockPortfoliosForPreviewVariables => ({
			...lastFilters,
			first: pagination.first,
			skip: pagination.skip,
			where: { user: { id: { equals: userId } } }
		}),
		[lastFilters, pagination, userId]
	);

	return (
		<div className={classnames(Classes.DARK, classes.root, className)}>
			<StockPortfolioFilter
				variables={filters}
				onChange={setFilters}
				onSubmit={onSubmitFilters}
			/>
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
