import React, { FC, memo, ReactNode, useMemo } from "react";
import { DataContext } from "./data.context";

export * from "./data.context";

interface IProps {
	children: ReactNode;
	data: readonly Record<string, any>[];
	onDataChange?: (data: readonly Record<string, any>[]) => void;
	onRowContextMenu?: FC<Record<string, any>>;
}

export const DataProvider: FC<IProps> = memo(
	({ children, data, onDataChange, onRowContextMenu }) => {
		const value = useMemo(() => ({ data, onDataChange, onRowContextMenu }), [
			data,
			onDataChange,
			onRowContextMenu
		]);

		return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
	}
);

DataProvider.displayName = "DataProvider";
