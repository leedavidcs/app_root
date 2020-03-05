import React, { FC, memo, ReactNode, useMemo } from "react";
import { DataContext, DataValue } from "./data.context";

export * from "./data.context";

interface IProps {
	children: ReactNode;
	data: readonly { [key: string]: DataValue }[];
	onDataChange: (data: readonly { [key: string]: DataValue }[]) => void;
}

export const DataProvider: FC<IProps> = memo(({ children, data, onDataChange }) => {
	const value = useMemo(() => ({ data, onDataChange }), [data, onDataChange]);

	return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
});

DataProvider.displayName = "DataProvider";
