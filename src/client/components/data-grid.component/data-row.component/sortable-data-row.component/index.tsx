import {
	DataContext,
	HeadersContext,
	IHeaderConfig,
	ScrollContext,
	SelectedCellContext
} from "@/client/components/data-grid.component";
import { useContextMenu } from "@/client/hooks";
import classnames from "classnames";
import { takeRightWhile, takeWhile } from "lodash";
import React, { CSSProperties, memo, ReactElement, useCallback, useContext, useMemo } from "react";
import { SortableElement } from "react-sortable-hoc";
import { DataCell } from "./data-cell.component";
import { useStyles } from "./styles";

interface IProps {
	data: readonly Record<string, any>[];
	rowIndex: number;
	style: CSSProperties;
}

export const SortableDataRow = SortableElement<IProps>(
	memo((props: IProps) => {
		const { data, rowIndex, style } = props;

		const { xOffset } = useContext(ScrollContext);

		const classes = useStyles({ xOffset });

		const { onRowContextMenu } = useContext(DataContext);
		const { headers } = useContext(HeadersContext);
		const { setSelectedCell } = useContext(SelectedCellContext);

		const rowData: Record<string, any> = data[rowIndex];

		const contextMenu: Maybe<ReactElement> = useMemo(() => onRowContextMenu?.(rowData), [
			onRowContextMenu,
			rowData
		]);

		const [onContextMenu] = useContextMenu(contextMenu);

		const onClick = useCallback(
			(_, location: { x: number; y: number }) => setSelectedCell(location),
			[setSelectedCell]
		);

		const getCellItems = useCallback(
			(configs: readonly IHeaderConfig[], offset = 0) => {
				return configs.map((header, i) => {
					const { value, width } = header;
					const adjIndex: number = i + offset;

					const cellData = rowData[value];

					return (
						<DataCell
							key={`${rowIndex}__${value}`}
							columnIndex={adjIndex}
							rowIndex={rowIndex}
							onClick={onClick}
							value={cellData}
							width={width}
						/>
					);
				});
			},
			[onClick, rowData, rowIndex]
		);

		const frozenCells: readonly ReactElement[] = useMemo(
			() => getCellItems(takeWhile(headers, { frozen: true })),
			[getCellItems, headers]
		);

		const unfrozenCells: readonly ReactElement[] = useMemo(
			() => getCellItems(takeRightWhile(headers, { frozen: false }), frozenCells.length),
			[getCellItems, headers, frozenCells.length]
		);

		const isEven: boolean = rowIndex % 2 === 0;

		return (
			<div
				className={classnames(classes.root, { [classes.evenRow]: isEven })}
				onContextMenu={onContextMenu}
				style={style}
			>
				<div className={classnames(classes.frozenPanel, { [classes.evenRow]: isEven })}>
					{frozenCells}
				</div>
				{unfrozenCells}
			</div>
		);
	})
);

SortableDataRow.displayName = "SortableDataRow";
