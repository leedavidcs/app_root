import { DataGrid, IHeaderConfig } from "@/client/components";
import { Snapshot as _Snapshot } from "@/client/graphql";
import classnames from "classnames";
import { format } from "date-fns";
import React, { FC, memo, useEffect, useMemo, useState } from "react";
import { useStyles } from "./styles";

type Snapshot = Pick<_Snapshot, "id" | "createdAt" | "data" | "headers">;

interface IProps {
	className?: string;
	snapshot: Snapshot;
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
	const { createdAt, headers } = snapshot;

	const classes = useStyles();

	const transformed: readonly IHeaderConfig[] = useMemo(
		() => [
			tickerHeader,
			...headers.map(({ dataKey, name }) => ({
				label: name,
				value: dataKey,
				options: null,
				editable: false,
				frozen: false,
				resizable: true,
				width: 100
			}))
		],
		[headers]
	);

	const [dataHeaders, setDataHeaders] = useState<readonly IHeaderConfig[]>(transformed);
	const [data, setData] = useState<readonly Record<string, any>[]>(snapshot.data);

	const formattedCreatedAt: string = useMemo(() => format(new Date(createdAt), "Ppp O"), [
		createdAt
	]);

	useEffect(() => setDataHeaders(transformed), [transformed]);
	useEffect(() => setData(snapshot.data), [snapshot.data]);

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
