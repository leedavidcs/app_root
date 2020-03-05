import { Context, createContext } from "react";

export type DataValue = number | string | null;

interface IDataContextProps {
	data: readonly { [key: string]: DataValue }[];
	onDataChange: (data: readonly { [key: string]: DataValue }[]) => void;
}

export const DataContext: Context<IDataContextProps> = createContext<IDataContextProps>({
	data: [],
	onDataChange: () => undefined
});

DataContext.displayName = "DataContext";
