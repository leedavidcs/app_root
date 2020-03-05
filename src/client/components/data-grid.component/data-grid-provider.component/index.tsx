import { IHeaderConfig } from "@/client/components/data-grid.component";
import React, { FC, memo, ReactNode } from "react";
import { Size } from "react-virtualized-auto-sizer";
import { AutoSizerProvider } from "./auto-sizer-provider.component";
import { DataProvider, DataValue } from "./data-provider.component";
import { HeadersProvider } from "./headers-provider.component";
import { ScrollProvider } from "./scroll-provider.component";

export * from "./auto-sizer-provider.component";
export * from "./data-provider.component";
export * from "./headers-provider.component";
export * from "./scroll-provider.component";

interface IProps {
	children: (size: Size) => ReactNode;
	data: readonly { [key: string]: DataValue }[];
	headers: readonly IHeaderConfig[];
	onDataChange: (data: readonly { [key: string]: DataValue }[]) => void;
	onHeadersChange: (headers: readonly IHeaderConfig[]) => void;
}

/**
 * @description Global properties provider to react-window.FixedSizeList.innerElementType and
 *     react-window.FixedSizeList.children (item renderer), since they cannot be passed such props
 *     directly
 */
export const DataGridProvider: FC<IProps> = memo(
	({ children, data, onDataChange, headers, onHeadersChange }) => {
		return (
			<DataProvider data={data} onDataChange={onDataChange}>
				<HeadersProvider headers={headers} onHeadersChange={onHeadersChange}>
					<ScrollProvider>
						<AutoSizerProvider>{children}</AutoSizerProvider>
					</ScrollProvider>
				</HeadersProvider>
			</DataProvider>
		);
	}
);

DataGridProvider.displayName = "DataGridProvider";
