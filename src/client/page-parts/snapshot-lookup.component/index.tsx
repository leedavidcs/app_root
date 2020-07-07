import {
	Button,
	DateRangeInput,
	ISelectItemType,
	Menu,
	Select,
	Spinner
} from "@/client/components";
import { InfiniteLoaderList } from "@/client/components/infinite-loader-list.component";
import {
	OrderByArg,
	Snapshot as _Snapshot,
	SnapshotWhereInput,
	useGetSnapshotsQuery
} from "@/client/graphql";
import type { DateRange } from "@blueprintjs/datetime";
import type { ItemListRenderer } from "@blueprintjs/select";
import classnames from "classnames";
import { format } from "date-fns";
import ms from "ms";
import React, { FC, ReactNodeArray, useCallback, useMemo, useState } from "react";
import { useStyles } from "./styles";

const ITEM_HEIGHT = 30;

type Snapshot = Pick<_Snapshot, "id" | "createdAt">;

interface IProps {
	className?: string;
	onChange?: (snapshot: Snapshot) => void;
	selected?: Snapshot | null;
	stockPortfolioId: string;
}

const SnapshotSelect = Select.ofType<Snapshot>();

const TypedLoaderList = InfiniteLoaderList.ofType<ISelectItemType<Snapshot>>();

const itemKey = ({ id }: Snapshot) => id;
const itemName = ({ createdAt }: Snapshot) => format(new Date(createdAt), "PPp");

export const SnapshotLookup: FC<IProps> = ({
	className,
	onChange = () => undefined,
	selected = null,
	stockPortfolioId
}) => {
	const classes = useStyles();

	const [snapshots, setSnapshots] = useState<readonly Snapshot[]>([]);
	const [dateRange, setDateRange] = useState<DateRange>([null, null]);

	const where: SnapshotWhereInput = useMemo(
		() => ({
			stockPortfolioId: { equals: stockPortfolioId },
			createdAt: { gte: dateRange[0] ?? undefined, lte: dateRange[1] ?? undefined }
		}),
		[dateRange, stockPortfolioId]
	);

	const { called, data, loading, refetch } = useGetSnapshotsQuery({
		variables: {
			where,
			orderBy: { createdAt: OrderByArg.Desc },
			take: 50
		},
		pollInterval: ms("2m"),
		onCompleted: (result) => setSnapshots(result.snapshots)
	});

	const count: number = data?.count ?? 0;

	const onLoadMore = useCallback(
		async (skip: number, take: number) => {
			const result = await refetch({
				where,
				orderBy: { createdAt: OrderByArg.Desc },
				take,
				skip
			});

			const newSnapshots = result.data?.snapshots ?? [];

			setSnapshots([...snapshots.slice(0, skip), ...newSnapshots]);
		},
		[refetch, snapshots, where]
	);

	const itemListRenderer: ItemListRenderer<ISelectItemType<Snapshot>> = useCallback(
		({ items, itemsParentRef, renderItem }) => (
			<>
				<DateRangeInput
					className={classes.dateInputs}
					inlineInputs={false}
					minimal={true}
					onChange={setDateRange}
					value={dateRange}
				/>
				<TypedLoaderList
					className={classes.list}
					count={count}
					innerElementType={({ children }) => (
						<Menu ulRef={itemsParentRef}>{children as ReactNodeArray}</Menu>
					)}
					itemRenderer={renderItem}
					items={items}
					itemSize={ITEM_HEIGHT}
					onLoadMore={onLoadMore}
					style={{ height: count * ITEM_HEIGHT }}
				/>
			</>
		),
		[classes.dateInputs, classes.list, count, dateRange, onLoadMore]
	);

	const onItemSelect = useCallback((newSelected: Snapshot) => onChange?.(newSelected), [
		onChange
	]);

	return (
		<SnapshotSelect
			className={classnames(classes.root, className)}
			activeItem={selected}
			filterable={false}
			itemKey={itemKey}
			itemListRenderer={itemListRenderer}
			itemName={itemName}
			items={snapshots}
			minimal={true}
			onItemSelect={onItemSelect}
			noResults={
				!called || loading ? (
					<Spinner size={20} />
				) : (
					<Menu.Item disabled={true} text="No snapshots" />
				)
			}
			usePortal={false}
		>
			<Button
				className={classes.btn}
				text={selected ? itemName(selected) : "Select Snapshot"}
			/>
		</SnapshotSelect>
	);
};
