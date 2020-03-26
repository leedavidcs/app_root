import { IHeaderConfig } from "@/client/components/data-grid.component";
import React, { FC, memo, ReactNode } from "react";
import { Size } from "react-virtualized-auto-sizer";
import { AutoSizerProvider } from "./auto-sizer-provider.component";
import { DataProvider } from "./data-provider.component";
import { HeadersProvider } from "./headers-provider.component";
import { ScrollProvider } from "./scroll-provider.component";

export * from "./auto-sizer-provider.component";
export * from "./data-provider.component";
export * from "./headers-provider.component";
export * from "./scroll-provider.component";

interface IProps {
	children: (size: Size) => ReactNode;
	data: readonly Record<string, any>[];
	headers: readonly IHeaderConfig[];
	onDataChange?: (data: readonly Record<string, any>[]) => void;
	onRowContextMenu?: FC<Record<string, any>>;
	onHeadersChange?: (headers: readonly IHeaderConfig[]) => void;
	onHeadersError?: (
		message: string,
		lastHeaders: readonly IHeaderConfig[],
		badHeaders: readonly IHeaderConfig[]
	) => void;
}

/**
 * @description Global properties provider to react-window.FixedSizeList.innerElementType and
 *     react-window.FixedSizeList.children (item renderer), since they cannot be passed such props
 *     directly
 */
export const DataGridProvider: FC<IProps> = memo(
	({
		children,
		data,
		onDataChange,
		headers,
		onHeadersChange,
		onHeadersError,
		onRowContextMenu
	}) => {
		return (
			<DataProvider
				data={data}
				onDataChange={onDataChange}
				onRowContextMenu={onRowContextMenu}
			>
				<HeadersProvider
					headers={headers}
					onHeadersChange={onHeadersChange}
					onHeadersError={onHeadersError}
				>
					<ScrollProvider>
						<AutoSizerProvider>{children}</AutoSizerProvider>
					</ScrollProvider>
				</HeadersProvider>
			</DataProvider>
		);
	}
);

DataGridProvider.displayName = "DataGridProvider";
