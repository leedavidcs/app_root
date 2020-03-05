import { HeadersContext } from "@/client/components/data-grid.component";
import React, { FC, useCallback, useContext } from "react";
import { SortEndHandler, SortEvent, SortEventWithTag } from "react-sortable-hoc";
import { DataGridHeadersProvider } from "./data-grid-headers-provider.component";
import { SortableDataGridHeaders } from "./sortable-data-grid-headers.component";
import { useStyles } from "./styles";

export * from "./data-grid-headers-provider.component";

// Required to prevent sorting, when the user intends to resize instead
const RESIZE_HANDLE_CLASS = "RESIZE_HANDLE_CLASS";
// Required in order to invoke click handlers, since sortable drag events block click events
const SORTABLE_HEADER_PRESS_DELAY = 100;

export const DataGridHeaders: FC<{}> = () => {
	const classes = useStyles();

	const { headers, moveHeaderItem } = useContext(HeadersContext);

	const onSortEnd: SortEndHandler = useCallback(
		({ newIndex, oldIndex }) => moveHeaderItem(oldIndex, newIndex),
		[moveHeaderItem]
	);

	const shouldCancelStart = useCallback(({ target }: SortEvent | SortEventWithTag): boolean => {
		const isResizeHandle: boolean = (target as HTMLElement).classList.contains(
			RESIZE_HANDLE_CLASS
		);

		return isResizeHandle;
	}, []);

	const resizeHandleClassName: string = RESIZE_HANDLE_CLASS;

	return (
		<DataGridHeadersProvider resizeHandleClassName={resizeHandleClassName}>
			<SortableDataGridHeaders
				className={classes.root}
				headers={headers}
				onSortEnd={onSortEnd}
				axis="x"
				lockAxis="x"
				shouldCancelStart={shouldCancelStart}
				pressDelay={SORTABLE_HEADER_PRESS_DELAY}
				helperClass={classes.helper}
			/>
		</DataGridHeadersProvider>
	);
};
