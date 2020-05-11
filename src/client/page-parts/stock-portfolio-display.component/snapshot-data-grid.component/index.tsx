import { DataGrid, IHeaderConfig } from "@/client/components";
import { Snapshot as _Snapshot, useGetSnapshotQuery } from "@/client/graphql";
import { NonIdealState, Spinner } from "@blueprintjs/core";
import classnames from "classnames";
import { format } from "date-fns";
import React, { FC, memo, useEffect, useMemo, useState } from "react";
import { useStyles } from "./styles";

type Snapshot = Pick<_Snapshot, "id">;

interface IProps {
	className?: string;
	snapshot: Maybe<Snapshot>;
}

const tickerHeader: IHeaderConfig = {
	label: "ticker",
	value: "ticker",
	options: null,
	editable: false,
	frozen: true,
	resizable: true,
	width: 100
};

export const SnapshotDataGrid: FC<IProps> = memo(({ className, snapshot }) => {
	const classes = useStyles();

	const queryResult = useGetSnapshotQuery({
		variables: { where: { id: snapshot?.id } }
	});

	const fullSnapshot = queryResult.data?.snapshot;

	const transformed: readonly IHeaderConfig[] = useMemo(
		() => [
			tickerHeader,
			...(fullSnapshot?.headers ?? []).map(({ dataKey, name }) => ({
				label: name,
				value: dataKey,
				options: null,
				editable: false,
				frozen: false,
				resizable: true,
				width: 100
			}))
		],
		[fullSnapshot]
	);

	const [dataHeaders, setDataHeaders] = useState<readonly IHeaderConfig[]>(transformed);
	const [data, setData] = useState<Maybe<readonly Record<string, any>[]>>(fullSnapshot?.data);

	const formattedCreatedAt: string = useMemo(
		() => (fullSnapshot ? format(new Date(fullSnapshot.createdAt), "Ppp O") : ""),
		[fullSnapshot]
	);

	useEffect(() => setDataHeaders(transformed), [transformed]);
	useEffect(() => setData(fullSnapshot?.data), [fullSnapshot, snapshot]);

	if (queryResult.loading) {
		return (
			<NonIdealState
				icon={<Spinner />}
				title="Loading..."
				description={<p>Your data should be loaded shortly.</p>}
			/>
		);
	}

	if (!data || data.length === 0) {
		return (
			<NonIdealState
				icon="search"
				title="No data available"
				description={<p>Could not load any data for this snapshot.</p>}
			/>
		);
	}

	return (
		<div className={classnames(classes.root, className)}>
			<p>Data from {formattedCreatedAt}</p>
			<DataGrid
				className={classes.dataGrid}
				data={data}
				headers={dataHeaders}
				onDataChange={setData}
				onHeadersChange={setDataHeaders}
			/>
		</div>
	);
});

SnapshotDataGrid.displayName = "SnapshotDataGrid";
