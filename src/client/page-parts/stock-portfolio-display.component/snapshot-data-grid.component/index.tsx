import { DataGrid, IHeaderConfig } from "@/client/components";
import { Snapshot as _Snapshot } from "@/client/graphql";
import React, { FC, memo, useEffect, useMemo, useState } from "react";

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
	const { headers } = snapshot;

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

	useEffect(() => setDataHeaders(transformed), [transformed]);
	useEffect(() => setData(snapshot.data), [snapshot.data]);

	return (
		<DataGrid
			className={className}
			data={data}
			headers={dataHeaders}
			onDataChange={setData}
			onHeadersChange={setDataHeaders}
		/>
	);
});

SnapshotDataGrid.displayName = "SnapshotDataGrid";
