import {
	Anchor,
	DateRangeInput,
	ExpansionPanel,
	SearchInput,
	TextInput
} from "@/client/components";
import { GetManyStockPortfoliosQueryVariables } from "@/client/graphql";
import { onInputValueChanged } from "@/client/utils";
import { Button } from "@blueprintjs/core";
import { DateRange } from "@blueprintjs/datetime";
import { DateTimeFilter } from "@prisma/client";
import { isNil } from "lodash";
import React, { FC, FormEventHandler, useCallback, useMemo, useState } from "react";
import { useStyles } from "./styles";
interface IProps {
	onChange: (variables: GetManyStockPortfoliosQueryVariables) => void;
	onSubmit: (variables: GetManyStockPortfoliosQueryVariables) => void;
	variables: GetManyStockPortfoliosQueryVariables;
}

const useOnQuery = ({
	onChange,
	variables
}: IProps): [string | undefined, FormEventHandler<HTMLInputElement>] => {
	const query: string | undefined = variables.query || undefined;

	const onQuery = useCallback(
		onInputValueChanged((value) => onChange({ ...variables, query: value })),
		[onChange, variables]
	);

	return [query, onQuery];
};

const toDate = (value: Maybe<string | Date>): Date | undefined => {
	if (isNil(value)) {
		return undefined;
	}

	if (typeof value === "string") {
		return new Date(value);
	}

	return value;
};

const useOnUpdatedAt = ({
	onChange,
	variables
}: IProps): [DateRange, (dateRange: DateRange) => void] => {
	const { gte, lte }: Pick<DateTimeFilter, "gte" | "lte"> = variables.where?.updatedAt ?? {};

	const dateRange: DateRange = useMemo(() => [toDate(gte), toDate(lte)], [gte, lte]);

	const onDateRange = useCallback(
		([first, last]: DateRange) => {
			onChange({
				...variables,
				where: {
					...variables.where,
					updatedAt: {
						...variables.where?.updatedAt,
						gte: first,
						lte: last
					}
				}
			});
		},
		[onChange, variables]
	);

	return [dateRange, onDateRange];
};

const useOnShowFilters = (): [boolean, () => void] => {
	const [showFilters, setShowFilters] = useState<boolean>(false);

	return [
		showFilters,
		useCallback(() => setShowFilters(!showFilters), [setShowFilters, showFilters])
	];
};

export const StockPortfolioFilter: FC<IProps> = (props) => {
	const { onSubmit: _onSubmit, variables } = props;

	const [dateRange, setDateRange] = useOnUpdatedAt(props);
	const [query, onQuery] = useOnQuery(props);
	const [showFilters, onShowFilters] = useOnShowFilters();

	const classes = useStyles();

	const SearchType = showFilters ? TextInput : SearchInput;

	const onSubmit = useCallback(() => {
		_onSubmit(variables);
	}, [_onSubmit, variables]);

	return (
		<ExpansionPanel
			active={showFilters}
			header={
				<div className={classes.filterContainer}>
					<SearchType
						className={classes.searchInput}
						icon="search"
						onChange={onQuery}
						onSubmit={onSubmit}
						placeholder="Filter"
						value={query}
					/>
					<Anchor
						className={classes.expandBtn}
						onClick={onShowFilters}
						value={showFilters ? "Close advanced filters" : "Show all filters"}
					/>
				</div>
			}
		>
			<div className={classes.advancedFilterContainer}>
				<DateRangeInput
					label="Date range"
					onChange={setDateRange}
					value={dateRange}
					shortcuts={false}
				/>
				<Button text="Filter" intent="primary" onClick={onSubmit} />
			</div>
		</ExpansionPanel>
	);
};
