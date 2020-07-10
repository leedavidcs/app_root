import React, { CSSProperties, FC, memo, ReactElement, useCallback } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

const DEFAULT_ITEM_SIZE = 30;

interface IProps<T extends any = any> {
	className?: string;
	count: number;
	innerElementType?: FC;
	itemRenderer: (item: T, i: number) => ReactElement | null;
	items: readonly T[];
	itemSize?: number;
	minimumBatchSize?: number;
	onLoadMore: (skip: number, offset: number) => Promise<void>;
	style?: CSSProperties;
}

interface IWithStaticProps {
	ofType: <T extends any = any>() => FC<IProps<T>>;
}

const ofType = <T extends any = any>() => {
	const component: FC<IProps<T>> = memo(
		({
			className,
			count,
			innerElementType,
			itemRenderer,
			items,
			itemSize = DEFAULT_ITEM_SIZE,
			minimumBatchSize,
			onLoadMore,
			style
		}) => {
			const Item: FC<ListChildComponentProps> = useCallback(
				(item) => {
					const element = itemRenderer(items[item.index], item.index);

					if (!element) {
						return null;
					}

					return React.cloneElement(element, { style: item.style });
				},
				[itemRenderer, items]
			);

			const isItemLoaded = useCallback((index: number) => index < items.length, [
				items.length
			]);

			const loadMoreItems = useCallback(
				(start: number, end: number): Promise<void> => onLoadMore(start, end - start),
				[onLoadMore]
			);

			return (
				<div className={className} style={style}>
					<AutoSizer>
						{({ height, width }) => (
							<InfiniteLoader
								itemCount={count}
								isItemLoaded={isItemLoaded}
								loadMoreItems={loadMoreItems}
								minimumBatchSize={minimumBatchSize}
							>
								{({ onItemsRendered, ref }) => (
									<FixedSizeList
										height={height}
										innerElementType={innerElementType}
										itemCount={count}
										itemSize={itemSize}
										onItemsRendered={onItemsRendered}
										ref={ref}
										width={width}
									>
										{Item}
									</FixedSizeList>
								)}
							</InfiniteLoader>
						)}
					</AutoSizer>
				</div>
			);
		}
	);

	component.displayName = "TypedInfiniteLoaderList";

	return component;
};

const _InfiniteLoaderList: FC<IProps> = ofType();
_InfiniteLoaderList.displayName = "InfiniteLoaderList";

(_InfiniteLoaderList as FC<IProps> & IWithStaticProps).ofType = ofType;

export const InfiniteLoaderList = _InfiniteLoaderList as FC<IProps> & IWithStaticProps;
