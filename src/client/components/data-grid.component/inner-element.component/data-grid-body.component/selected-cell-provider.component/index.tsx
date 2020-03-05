import { ClickOutside } from "@/client/components/click-outside.component";
import React, { FC, ReactNode, useCallback, useMemo, useState } from "react";
import { SelectedCellContext } from "./selected-cell.context";

export * from "./selected-cell.context";

interface IProps {
	children: ReactNode;
}

export const SelectedCellProvider: FC<IProps> = ({ children }) => {
	const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);

	const onClickOut = useCallback(() => setSelectedCell(null), [setSelectedCell]);

	const value = useMemo(() => ({ selectedCell, setSelectedCell }), [
		selectedCell,
		setSelectedCell
	]);

	return (
		<ClickOutside onClick={onClickOut}>
			<div>
				<SelectedCellContext.Provider value={value}>
					{children}
				</SelectedCellContext.Provider>
			</div>
		</ClickOutside>
	);
};
