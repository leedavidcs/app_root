import { Select } from "@/client/components/input.component";
import { useSearchStockSymbolsLazyQuery } from "@/client/graphql";
import { Menu } from "@blueprintjs/core";
import { ItemRenderer } from "@blueprintjs/select";
import { debounce } from "lodash";
import React, { FC, memo, ReactElement, useCallback, useMemo } from "react";
import { useStyles } from "./styles";

const DEBOUNCE_ON_SEARCH = 1000;

interface IProps {
	children: ReactElement;
	onSelect: (symbol: ISelectItem) => void;
}

interface ISelectItem {
	key: string;
	symbol: string;
	securityName: string;
}

const TypedSelect = Select.ofType<ISelectItem>();

const itemRenderer: ItemRenderer<ISelectItem> = (item, itemProps) => {
	const { key, symbol, securityName } = item;
	const { handleClick, modifiers } = itemProps;

	return (
		<Menu.Item
			key={key}
			active={modifiers.active}
			disabled={modifiers.disabled}
			onClick={handleClick}
			text={symbol}
		>
			{securityName}
		</Menu.Item>
	);
};

export const StockSymbolSearch: FC<IProps> = memo(({ children, onSelect }) => {
	const classes = useStyles();

	const [searchSymbols, { data, loading }] = useSearchStockSymbolsLazyQuery();

	const onQuery = useCallback(
		debounce((text: string) => searchSymbols({ variables: { text } }), DEBOUNCE_ON_SEARCH),
		[searchSymbols]
	);

	const items: readonly ISelectItem[] = useMemo(() => {
		const stockSymbols = data?.stockSymbols ?? [];

		return stockSymbols.map(({ symbol, securityName }) => ({
			key: symbol,
			symbol,
			securityName
		}));
	}, [data]);

	return (
		<TypedSelect
			className={classes.root}
			itemRenderer={itemRenderer}
			items={items}
			minimal={true}
			noResults={<Menu.Item disabled={true} text={loading ? "Loading..." : "No results."} />}
			onItemSelect={onSelect}
			onQueryChange={onQuery}
			queryPlaceholder="Search..."
			resetOnClose={true}
			resetOnSelect={true}
			usePortal={false}
		>
			{children}
		</TypedSelect>
	);
});

StockSymbolSearch.displayName = "StockSymbolSearch";
