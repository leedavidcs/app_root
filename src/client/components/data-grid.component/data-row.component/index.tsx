import { DataValue } from "@/client/components/data-grid.component";
import React, { FC, memo } from "react";
import { ListChildComponentProps } from "react-window";
import { SortableDataRow } from "./sortable-data-row.component";

interface IProps extends ListChildComponentProps {
	data: readonly { [key: string]: DataValue }[];
}

/**
 * @description This is the item renderer for react-window.FixedSizeList
 * @see children @ https://react-window.now.sh/#/api/FixedSizeList
 */
export const DataRow: FC<IProps> = memo(({ data, index, style }) => {
	return <SortableDataRow data={data} rowIndex={index} style={style} index={index} />;
});

DataRow.displayName = "DataRow";
