import React, { FC, memo } from "react";
import { FixedSizeList, ListOnItemsRenderedProps } from "react-window";
import { DataGridProvider } from "./data-grid-provider.component";
import { DataRow } from "./data-row.component";
import { InnerElement } from "./inner-element.component";
import { OuterElement } from "./outer-element.component";

const DEFAULT_ROW_HEIGHT = 28;

export * from "./data-grid-provider.component";
export * from "./inner-element.component";

export interface IHeaderOption {
	/** The text that gets displayed on the data-grid header */
	label: string;
	/** The key of the data that is fetched for this column */
	value: string;
}

export interface IHeaderConfig extends IHeaderOption {
	/** Whether this column can be dragged (for re-sorting) */
	frozen: boolean;
	/** If supplied, headers are selected by a dropdown, else this is just a plain-text input */
	options: readonly IHeaderOption[] | null;
	/** Whether this column can be resized */
	resizable: boolean;
	/** The width of this column */
	width: number;
}

export interface IDataGridProps<T extends Record<string, any>> {
	/** Entities array */
	data: readonly T[];
	/** Column data is: `data[headers[i].value]` */
	headers: readonly IHeaderConfig[];
	/** The number of rows (data) in this data-grid */
	itemCount?: number;
	/**
	 * Function to derive the key prop for each row of the data-grid. Defaults to index.
	 *
	 * @default (index: number) => index.toString()
	 */
	itemKey?: (index: number, data: readonly T[]) => string;
	/**
	 * `data` is a controlled property, to be set externally through `onDataChange`
	 *
	 * @default () => undefined
	 */
	onDataChange?: (data: readonly T[]) => void;
	/**
	 * `headers` is a controlled property, to be set externally through `onHeadersChange`
	 *
	 * @default () => undefined
	 */
	onHeadersChange?: (headers: readonly IHeaderConfig[]) => void;
	/** See `onItemsRendered` (https://react-window.now.sh/#/api/FixedSizeList) */
	onItemsRendered?: (props: ListOnItemsRenderedProps) => void;
	/** Render a context menu when a row is right-clicked, using the data from the row */
	onRowContextMenu?: FC<T>;
}

interface IWithStaticExports {
	asTyped: <T extends Record<string, any>>() => FC<IDataGridProps<T>>;
}

const asTyped = <T extends Record<string, any>>() => {
	const component: FC<IDataGridProps<T>> = memo(
		({
			data,
			headers,
			itemCount: _itemCount,
			itemKey = (index: number) => index.toString(),
			onDataChange,
			onHeadersChange,
			onItemsRendered,
			onRowContextMenu
		}) => {
			const itemCount = typeof _itemCount === "number" ? _itemCount : data.length;

			return (
				<DataGridProvider
					data={data}
					onDataChange={onDataChange as (data: readonly Record<string, any>[]) => void}
					headers={headers}
					onHeadersChange={onHeadersChange}
					onRowContextMenu={onRowContextMenu as FC<Record<string, any>>}
				>
					{({ height, width }) => (
						<FixedSizeList
							height={height}
							width={width}
							itemCount={itemCount}
							itemData={data}
							itemKey={itemKey}
							itemSize={DEFAULT_ROW_HEIGHT}
							innerElementType={InnerElement}
							onItemsRendered={onItemsRendered}
							outerElementType={OuterElement}
						>
							{DataRow}
						</FixedSizeList>
					)}
				</DataGridProvider>
			);
		}
	);

	component.displayName = "TypedDataGrid";

	return component;
};

const _DataGrid: FC<IDataGridProps<Record<string, any>>> = asTyped<Record<string, any>>();
_DataGrid.displayName = "DataGrid";

(_DataGrid as FC<IDataGridProps<Record<string, any>>> & IWithStaticExports).asTyped = asTyped;

export const DataGrid = _DataGrid as FC<IDataGridProps<Record<string, any>>> & IWithStaticExports;
