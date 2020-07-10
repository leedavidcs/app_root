import { Button, IPaginationProps, OnPageProps, Pagination } from "@/client/components";
import {
	CreateStockPortfolioMutation,
	GetManyStockPortfoliosQueryVariables,
	useCreateStockPortfolioMutation,
	useGetManyStockPortfoliosQuery
} from "@/client/graphql";
import classnames from "classnames";
import { NextRouter, useRouter } from "next/router";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { StockPortfolioFilter } from "./stock-portfolio-filter.component";
import { StockPortfolioList } from "./stock-portfolio-list.component";
import { useStyles } from "./styles";

const DEFAULT_PAGINATION_TAKE = 10;
const DEFAULT_PAGINATION_SKIP = 0;

interface IProps {
	className?: string;
	userId?: string;
}

const useOnPage = (
	filters: GetManyStockPortfoliosQueryVariables
): [Pick<IPaginationProps, "take" | "skip">, (value: OnPageProps) => void] => {
	const [take, setTake] = useState<number>(DEFAULT_PAGINATION_TAKE);
	const [skip, setSkip] = useState<number>(DEFAULT_PAGINATION_SKIP);

	const onPage = useCallback(
		(value: OnPageProps) => {
			setTake(value.take);
			setSkip(value.skip);
		},
		[setSkip]
	);

	useEffect(() => {
		setTake(filters.take ?? DEFAULT_PAGINATION_TAKE);
		setSkip(filters.skip ?? DEFAULT_PAGINATION_SKIP);
	}, [filters.skip, filters.take]);

	const pagination: Pick<IPaginationProps, "take" | "skip"> = useMemo(() => ({ take, skip }), [
		skip,
		take
	]);

	return [pagination, onPage];
};

const useOnClickNew = () => {
	const router: NextRouter = useRouter();

	const onCompleted = useCallback(
		(data: CreateStockPortfolioMutation) => {
			const { id } = data.createOneStockPortfolio;

			router.push(`/stock-portfolios/${id}`);
		},
		[router]
	);

	const [createStockPortfolio] = useCreateStockPortfolioMutation({ onCompleted });

	return useCallback(() => {
		createStockPortfolio({
			variables: { name: "New_Portfolio" }
		});
	}, [createStockPortfolio]);
};

export const StockPortfolioLookup: FC<IProps> = (props) => {
	const { className, userId } = props;

	const classes = useStyles();

	const [filters, setFilters] = useState<GetManyStockPortfoliosQueryVariables>({
		where: {
			user: { id: { equals: userId } }
		}
	});
	const [lastFilters, setLastFilters] = useState<GetManyStockPortfoliosQueryVariables>(filters);
	const [pagination, onPage] = useOnPage(filters);

	const onClickNew = useOnClickNew();

	const onSubmitFilters = useCallback(
		(value: GetManyStockPortfoliosQueryVariables) => setLastFilters({ ...value }),
		[setLastFilters]
	);

	const variables = useMemo(
		(): GetManyStockPortfoliosQueryVariables => ({
			...lastFilters,
			take: pagination.take,
			skip: pagination.skip,
			where: { user: { id: { equals: userId } } }
		}),
		[lastFilters, pagination, userId]
	);

	const { data, loading, refetch } = useGetManyStockPortfoliosQuery({
		variables,
		fetchPolicy: "no-cache"
	});

	return (
		<div className={classnames(classes.root, className)}>
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
					loading={loading}
					onDelete={refetch}
					stockPortfolios={data?.stockPortfolios}
				/>
			</div>
			<Pagination
				className={classes.pagination}
				take={pagination.take}
				skip={pagination.skip}
				count={data?.count ?? 0}
				onPage={onPage}
				showLimitConfig={true}
			/>
		</div>
	);
};
