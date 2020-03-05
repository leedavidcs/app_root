import { DataValue, SelectedCellContext } from "@/client/components/data-grid.component";
import classnames from "classnames";
import React, { FC, memo, useCallback, useContext, useMemo } from "react";
import { DragHandle } from "./drag-handle.component";
import { useStyles } from "./styles";

const EVEN = 2;

interface IProps {
	columnIndex: number;
	onClick: (value: DataValue, location: { x: number; y: number }) => void;
	rowIndex: number;
	value: DataValue;
	width: number;
}

export const DataCell: FC<IProps> = memo(
	({ columnIndex, onClick: propsOnClick, rowIndex, value, width }) => {
		const classes = useStyles();

		const { selectedCell } = useContext(SelectedCellContext);

		const isEvenRow: boolean = rowIndex % EVEN === 0;
		const isFirstColumn: boolean = columnIndex === 0;

		const isSelected: boolean = useMemo(() => {
			if (selectedCell === null) {
				return false;
			}

			const { x, y } = selectedCell;

			const isSelectedColumn: boolean = x === columnIndex;
			const isSelectedRow: boolean = y === rowIndex;

			return isSelectedColumn && isSelectedRow;
		}, [rowIndex, columnIndex, selectedCell]);

		const onClick = useCallback(() => {
			const x: number = columnIndex;
			const y: number = rowIndex;

			propsOnClick(value, { x, y });
		}, [columnIndex, propsOnClick, rowIndex, value]);

		return (
			<div
				className={classnames(classes.root, {
					[classes.selected]: isSelected,
					[classes.evenRow]: isEvenRow,
					[classes.firstColumn]: isFirstColumn
				})}
				onClick={onClick}
				style={{ minWidth: width }}
			>
				{isFirstColumn && <DragHandle />}
				{value}
			</div>
		);
	}
);

DataCell.displayName = "DataCell";
