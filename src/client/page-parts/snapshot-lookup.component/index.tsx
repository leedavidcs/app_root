import { DateRangeInput, ISelectItemType, Menu, Select } from "@/client/components";
import {
	GetSnapshotDocument,
	GetSnapshotQuery,
	GetSnapshotQueryVariables,
	OrderByArg,
	Snapshot as _Snapshot,
	useGetSnapshotsQuery
} from "@/client/graphql";
import { Button, Spinner } from "@blueprintjs/core";
import { DateRange } from "@blueprintjs/datetime";
import { ItemListRenderer } from "@blueprintjs/select";
import classnames from "classnames";
import { format } from "date-fns";
import ms from "ms";
import React, { FC, useCallback } from "react";
import { useApolloClient } from "react-apollo";
import { useStyles } from "./styles";

type Snapshot = Pick<_Snapshot, "id" | "createdAt">;
type ResultSnapshot = Pick<_Snapshot, "id" | "tickers" | "headers" | "data" | "createdAt">;

interface IProps {
	className?: string;
	dateRange?: DateRange;
	onChange?: (snapshot: ResultSnapshot) => void;
	onDateRangeChange?: (dateRange: DateRange) => void;
	selected?: Snapshot | null;
	stockPortfolioId: string;
}

const SnapshotSelect = Select.ofType<Snapshot>();

const itemKey = ({ id }: Snapshot) => id;
const itemName = ({ createdAt }: Snapshot) => format(createdAt, "PPp");

export const SnapshotLookup: FC<IProps> = ({
	className,
	dateRange = [null, null],
	onChange = () => undefined,
	onDateRangeChange,
	selected = null,
	stockPortfolioId
}) => {
	const classes = useStyles();

	const apolloClient = useApolloClient();
	const { called, data, loading } = useGetSnapshotsQuery({
		pollInterval: ms("2m"),
		variables: {
			where: {
				stockPortfolioId: { equals: stockPortfolioId },
				createdAt: { gte: dateRange[0], lte: dateRange[1] }
			},
			orderBy: { createdAt: OrderByArg.Desc },
			first: 50
		}
	});

	const itemListRenderer: ItemListRenderer<ISelectItemType<Snapshot>> = useCallback(
		({ items, itemsParentRef, renderItem }) => {
			return (
				<>
					<DateRangeInput
						className={classes.dateInputs}
						inlineInputs={false}
						minimal={true}
						onChange={onDateRangeChange}
						value={dateRange}
					/>
					<Menu ulRef={itemsParentRef}>
						{items.map((item, i) => renderItem(item, i))}
					</Menu>
				</>
			);
		},
		[classes.dateInputs, dateRange, onDateRangeChange]
	);

	const onItemSelect = useCallback(
		async ({ id }: Snapshot) => {
			const results = await apolloClient.query<GetSnapshotQuery, GetSnapshotQueryVariables>({
				query: GetSnapshotDocument,
				variables: { where: { id } }
			});

			const snapshot: Maybe<ResultSnapshot> = results.data?.snapshot;

			if (snapshot) {
				onChange?.(snapshot);
			}
		},
		[apolloClient, onChange]
	);

	return (
		<SnapshotSelect
			className={classnames(classes.root, className)}
			activeItem={selected}
			filterable={false}
			itemKey={itemKey}
			itemListRenderer={itemListRenderer}
			itemName={itemName}
			items={data?.snapshots ?? []}
			minimal={true}
			onItemSelect={onItemSelect}
			noResults={
				!called || loading ? (
					<Spinner size={Spinner.SIZE_SMALL} />
				) : (
					<Menu.Item disabled={true} text="No snapshots" />
				)
			}
		>
			<Button
				className={classes.btn}
				text={selected ? itemName(selected) : "Select Snapshot"}
			/>
		</SnapshotSelect>
	);
};
