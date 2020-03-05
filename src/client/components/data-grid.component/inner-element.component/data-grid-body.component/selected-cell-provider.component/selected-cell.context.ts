import { Context, createContext, Dispatch, SetStateAction } from "react";

interface ISelectedCellContextProps {
	selectedCell: { x: number; y: number } | null;
	setSelectedCell: Dispatch<SetStateAction<{ x: number; y: number } | null>>;
}

export const SelectedCellContext: Context<ISelectedCellContextProps> = createContext<
	ISelectedCellContextProps
>({
	selectedCell: null,
	setSelectedCell: () => undefined
});

SelectedCellContext.displayName = "SelectedCellContext";
