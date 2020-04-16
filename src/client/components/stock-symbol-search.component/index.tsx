import { Select } from "@/client/components/input.component";
import { SearchStockSymbolsQuery, useSearchStockSymbolsLazyQuery } from "@/client/graphql";
import { Menu } from "@blueprintjs/core";
import classnames from "classnames";
import { debounce } from "lodash";
import React, { FC, memo, ReactElement, useCallback } from "react";
import { useStyles } from "./styles";

const DEBOUNCE_ON_SEARCH = 1000;

export type StockSymbolSearchItem = SearchStockSymbolsQuery["stockSymbols"][number];

interface IProps {
	children: ReactElement;
	className?: string;
	onSelect: (symbol: StockSymbolSearchItem) => void;
}

const TypedSelect = Select.ofType<StockSymbolSearchItem>();

export const StockSymbolSearch: FC<IProps> = memo(({ children, className, onSelect }) => {
	const classes = useStyles();

	const [searchSymbols, { data, loading }] = useSearchStockSymbolsLazyQuery({
		fetchPolicy: "no-cache"
	});

	const onQuery = useCallback(
		debounce((text: string) => searchSymbols({ variables: { text } }), DEBOUNCE_ON_SEARCH),
		[searchSymbols]
	);

	const itemKey = useCallback((item: StockSymbolSearchItem) => item.symbol, []);
	const itemName = itemKey;

	return (
		<TypedSelect
			className={classnames(classes.root, className)}
			itemKey={itemKey}
			itemName={itemName}
			items={data?.stockSymbols ?? []}
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
