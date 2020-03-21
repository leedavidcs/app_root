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

interface IProps {
	/** Entities array */
	data: readonly Record<string, any>[];
	/** Column data is: `data[headers[i].value]` */
	headers: readonly IHeaderConfig[];
	/** The number of rows (data) in this data-grid */
	itemCount?: number;
	/**
	 * Function to derive the key prop for each row of the data-grid. Defaults to index.
	 *
	 * @default (index: number) => index.toString()
	 */
	itemKey?: (index: number, data: readonly Record<string, any>[]) => string;
	/**
	 * `data` is a controlled property, to be set externally through `onDataChange`
	 *
	 * @default () => undefined
	 */
	onDataChange?: (data: readonly Record<string, any>[]) => void;
	/**
	 * `headers` is a controlled property, to be set externally through `onHeadersChange`
	 *
	 * @default () => undefined
	 */
	onHeadersChange?: (headers: readonly IHeaderConfig[]) => void;
	/** See `onItemsRendered` (https://react-window.now.sh/#/api/FixedSizeList) */
	onItemsRendered?: (props: ListOnItemsRenderedProps) => void;
}

export const DataGrid: FC<IProps> = memo(
	({
		data,
		headers,
		itemCount: _itemCount,
		itemKey = (index: number) => index.toString(),
		onDataChange = () => undefined,
		onHeadersChange = () => undefined,
		onItemsRendered
	}) => {
		const itemCount = typeof _itemCount === "number" ? _itemCount : data.length;

		return (
			<DataGridProvider
				data={data}
				onDataChange={onDataChange}
				headers={headers}
				onHeadersChange={onHeadersChange}
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

DataGrid.displayName = "DataGrid";
