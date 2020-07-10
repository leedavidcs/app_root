import { AutoSizerContext, DataContext } from "@/client/components/data-grid.component";
import arrayMove from "array-move";
import React, { FC, memo, ReactNode, useCallback, useContext } from "react";
import { SortEndHandler } from "react-sortable-hoc";
import { SelectedCellProvider } from "./selected-cell-provider.component";
import { SortableDataGridBody } from "./sortable-data-grid-body.component";
import { useStyles } from "./styles";

export * from "./selected-cell-provider.component";

interface IProps {
	children: ReactNode;
}

export const DataGridBody: FC<IProps> = memo(({ children }) => {
	const { width } = useContext(AutoSizerContext);
	const { data, onDataChange } = useContext(DataContext);

	const classes = useStyles({ width });

	const onSortEnd: SortEndHandler = useCallback(
		({ newIndex, oldIndex }) => {
			const newData: { [key: string]: any }[] = data.slice();

			const sortedData: readonly { [key: string]: any }[] = arrayMove(
				newData,
				oldIndex,
				newIndex
			);

			onDataChange?.(sortedData);
		},
		[data, onDataChange]
	);

	return (
		<SelectedCellProvider>
			<SortableDataGridBody
				className={classes.root}
				onSortEnd={onSortEnd}
				axis="y"
				lockAxis="y"
				useDragHandle={true}
				helperClass={classes.helper}
			>
				{children}
			</SortableDataGridBody>
		</SelectedCellProvider>
	);
});
