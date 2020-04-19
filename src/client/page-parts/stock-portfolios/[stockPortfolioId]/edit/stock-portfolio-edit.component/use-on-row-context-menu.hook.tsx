import { Menu } from "@blueprintjs/core";
import React, { useCallback } from "react";
import { IStockPortfolioEditData, UseDataResult } from "./use-data.hook.";

export const useOnRowContextMenu = ({ removeTicker }: UseDataResult[1]) => {
	const onDelete = useCallback((ticker: string) => () => removeTicker(ticker), [removeTicker]);

	const onRowContextMenu = useCallback(
		({ ticker }: IStockPortfolioEditData) => (
			<Menu>
				<Menu.Item onClick={onDelete(ticker)} text="Delete" />
			</Menu>
		),
		[onDelete]
	);

	return onRowContextMenu;
};
