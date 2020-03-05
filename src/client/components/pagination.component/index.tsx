import { Interactable } from "@/client/components/interactable.component";
import { head, initial, isUndefined, last, range } from "lodash";
import React, { FC, Fragment, useCallback, useMemo } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { getCurrentPage, getPageCount, getSkipFromPage } from "./get-page-info";
import { PageSearch } from "./page-search.component";
import { useStyles } from "./styles";

const DEFAULT_INNER_PAGE_RANGE = 5;
const DEFAULT_MARGIN_PAGE_RANGE = 2;

export interface IPaginationProps {
	count: number;
	first: number;
	skip: number;
}

interface IRangeOptions {
	/** The minimum number of pages that are shown, centered around the current page. */
	innerRange: number;
	/** The minimum number of pages that are shown at the ends of the paginator. */
	marginRange: number;
}

interface IProps extends IPaginationProps, Partial<IRangeOptions> {
	onPage?: (props: IPaginationProps) => void;
}

interface IGetPageRangesProps extends IRangeOptions {
	currentPage: number;
	pageCount: number;
}

const doesOverlap = (firstRange: readonly number[], secondRange: readonly number[]): boolean => {
	const largestOfFirst = last(firstRange);
	const smallestOfSecond = head(secondRange);

	if (isUndefined(largestOfFirst) || isUndefined(smallestOfSecond)) {
		return false;
	}

	return largestOfFirst + 1 >= smallestOfSecond;
};

const mergeOverlap = (
	firstRange: readonly number[],
	secondRange: readonly number[]
): readonly number[] => {
	const largestOfFirst = last(firstRange);

	if (isUndefined(largestOfFirst)) {
		return secondRange;
	}

	return firstRange.concat(secondRange.filter((num) => num > largestOfFirst));
};

const mergeAllRangeOverlaps = (
	pageRanges: readonly (readonly number[])[]
): readonly (readonly number[])[] => {
	return pageRanges.reduce((acc, currentRange) => {
		const previousRange = last(acc);

		if (isUndefined(previousRange)) {
			return [currentRange];
		}

		if (!doesOverlap(previousRange, currentRange)) {
			return [...acc, currentRange];
		}

		return [...initial(acc), mergeOverlap(previousRange, currentRange)];
	}, [] as readonly (readonly number[])[]);
};

/**
 * @description Returns page ranges such that if there are any gaps between margin pages and inner
 *     pages, ellipsis are shown.
 */
const getPageRanges = ({
	pageCount,
	currentPage,
	innerRange,
	marginRange
}: IGetPageRangesProps): readonly (readonly number[])[] => {
	if (pageCount === 0) {
		return [];
	}

	const innerOffset: number = (innerRange - 1) / 2;

	const startRange: readonly number[] = range(0, Math.min(marginRange, pageCount));
	const centerRange: readonly number[] = range(
		Math.max(0, currentPage - Math.floor(innerOffset)),
		Math.min(currentPage + Math.ceil(innerOffset + 1), pageCount)
	);
	const endRange: readonly number[] = range(Math.max(0, pageCount - marginRange), pageCount);

	const pageRanges: readonly (readonly number[])[] = [startRange, centerRange, endRange];

	return mergeAllRangeOverlaps(pageRanges);
};

export const Pagination: FC<IProps> = ({
	count,
	first,
	skip,
	innerRange = DEFAULT_INNER_PAGE_RANGE,
	marginRange = DEFAULT_MARGIN_PAGE_RANGE,
	onPage = () => undefined
}) => {
	const classes = useStyles();

	const pageCount: number = useMemo(() => getPageCount({ count, first }), [count, first]);
	const currentPage: number = useMemo(() => getCurrentPage({ first, skip }), [first, skip]);

	const pageRanges: readonly (readonly number[])[] = useMemo(
		() => getPageRanges({ pageCount, currentPage, innerRange, marginRange }),
		[pageCount, currentPage, innerRange, marginRange]
	);

	const isLastPage = useCallback((i: number) => i === pageRanges.length - 1, [pageRanges]);

	const onClickPage = useCallback(
		(page: number) => () => onPage?.({ count, first, skip: getSkipFromPage(page, first) }),
		[onPage, count, first]
	);

	return (
		<div className={classes.root}>
			<Interactable>
				<FaAngleLeft />
			</Interactable>
			{pageRanges.map((pageRange, i) => (
				<Fragment key={i}>
					{pageRange.map((page) => (
						<Interactable
							key={page}
							active={currentPage === page}
							onClick={onClickPage(page)}
						>
							{page + 1}
						</Interactable>
					))}
					{!isLastPage(i) && (
						<PageSearch count={count} first={first} skip={skip} onPage={onPage} />
					)}
				</Fragment>
			))}
			<Interactable>
				<FaAngleRight />
			</Interactable>
		</div>
	);
};
