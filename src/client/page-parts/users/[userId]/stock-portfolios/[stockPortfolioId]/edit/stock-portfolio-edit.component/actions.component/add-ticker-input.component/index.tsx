import { IStockSymbolSearchItem, StockSymbolSearch } from "@/client/components";
import { Button } from "@blueprintjs/core";
import React, { FC, useCallback } from "react";

interface IProps {
	className?: string;
	onAddTicker: (ticker: string) => void;
}

export const AddTickerInput: FC<IProps> = ({ className, onAddTicker }) => {
	const onSelect = useCallback(({ symbol }: IStockSymbolSearchItem) => onAddTicker(symbol), [
		onAddTicker
	]);

	return (
		<StockSymbolSearch className={className} onSelect={onSelect}>
			<Button icon="plus" text="Add ticker" />
		</StockSymbolSearch>
	);
};
