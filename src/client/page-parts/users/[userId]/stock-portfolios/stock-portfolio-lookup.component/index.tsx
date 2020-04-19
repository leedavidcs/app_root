import { IPaginationProps, Pagination } from "@/client/components";
import {
	CreateStockPortfolioMutation,
	GetManyStockPortfoliosQueryVariables,
	useCreateStockPortfolioMutation,
	useGetManyStockPortfoliosQuery
} from "@/client/graphql";
import { Button, Classes } from "@blueprintjs/core";
import classnames from "classnames";
import { NextRouter, useRouter } from "next/router";
import React, { FC, useCallback, useMemo, useState } from "react";
import { StockPortfolioFilter } from "./stock-portfolio-filter.component";
import { StockPortfolioList } from "./stock-portfolio-list.component";
import { useStyles } from "./styles";

const DEFAULT_PAGINATION_FIRST = 10;

interface IProps {
	className?: string;
	userId?: string;
}

const useOnPage = (
	filters: GetManyStockPortfoliosQueryVariables
): [Pick<IPaginationProps, "first" | "skip">, (value: IPaginationProps) => void] => {
	const [first, setFirst] = useState<number>(DEFAULT_PAGINATION_FIRST);
	const [skip, setSkip] = useState<number>(0);

	const pagination: Pick<IPaginationProps, "first" | "skip"> = useMemo(() => ({ first, skip }), [
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
			first: pagination.first,
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
					loading={loading}
					onDelete={refetch}
					stockPortfolios={data?.stockPortfolios}
				/>
			</div>
			<Pagination
				className={classes.pagination}
				first={pagination.first}
				skip={pagination.skip}
				count={data?.count ?? 0}
				onPage={onPage}
				showLimitConfig={true}
			/>
		</div>
	);
};
