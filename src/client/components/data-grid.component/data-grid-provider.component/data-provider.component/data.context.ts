import { Context, createContext, FC } from "react";

interface IDataContextProps {
	data: readonly Record<string, any>[];
	onDataChange?: (data: readonly Record<string, any>[]) => void;
	onRowContextMenu?: FC<Record<string, any>>;
}

export const DataContext: Context<IDataContextProps> = createContext<IDataContextProps>({
	data: []
});

DataContext.displayName = "DataContext";
