import { Button } from "@/client/components";
import {
	StockSymbolSearch,
	StockSymbolSearchItem
} from "@/client/page-parts/stock-symbol-search.component";
import React, { FC, useCallback } from "react";

interface IProps {
	className?: string;
	onAddTicker: (ticker: string) => void;
}

export const AddTickerInput: FC<IProps> = ({ className, onAddTicker }) => {
	const onSelect = useCallback(({ symbol }: StockSymbolSearchItem) => onAddTicker(symbol), [
		onAddTicker
	]);

	return (
		<StockSymbolSearch className={className} onSelect={onSelect}>
			<Button icon="plus" text="Add ticker" />
		</StockSymbolSearch>
	);
};
