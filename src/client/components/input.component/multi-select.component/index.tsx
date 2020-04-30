import { Button, Classes, IPopoverProps, ITagInputProps, Menu } from "@blueprintjs/core";
import { ItemPredicate, ItemRenderer, MultiSelect as BpMultiSelect } from "@blueprintjs/select";
import classnames from "classnames";
import { get, toString } from "lodash";
import React, {
	ChangeEvent,
	ComponentType,
	FC,
	memo,
	ReactNode,
	ReactText,
	SyntheticEvent,
	useCallback,
	useMemo
} from "react";
import { DefaultItemRenderer, IItemProps } from "./default-item-renderer.component";
import { useStyles } from "./styles";

export interface IMultiSelectItemType<T = any> {
	info: ReactNode;
	key: ReactText;
	name: ReactText;
	value: T;
}

export interface IMultiSelectProps<T, TOriginal = T> {
	className?: string;
	disabled?: boolean;
	itemInfo?: (item: TOriginal) => ReactNode;
	itemKey?: (item: TOriginal) => ReactText;
	itemMap?: {
		from: (original: TOriginal) => T;
		to: (to: T) => TOriginal;
	};
	itemName?: (item: TOriginal) => ReactText;
	itemPredicate?: ItemPredicate<IMultiSelectItemType<TOriginal>>;
	itemRenderer?: ComponentType<IItemProps<TOriginal>>;
	items: readonly TOriginal[];
	minimal?: boolean;
	noResults?: ReactNode;
	onItemRemove?: (items: readonly T[], removedItem?: T) => void;
	onItemsClear?: () => void;
	onItemSelect: (item: T, event?: SyntheticEvent<HTMLElement>) => void;
	onQueryChange?: (query: string, event?: ChangeEvent<HTMLInputElement>) => void;
	query?: string;
	queryPlaceholder?: string;
	resetOnQuery?: boolean;
	resetOnSelect?: boolean;
	selectedItems?: readonly T[];
	usePortal?: boolean;
}

interface IWithStaticExports {
	ofType: <T extends any, TOriginal = T>() => FC<IMultiSelectProps<T, TOriginal>>;
}

const ofType = <T extends any, TOriginal = T>() => {
	type InternalItem = IMultiSelectItemType<TOriginal>;

	const TypedMultiSelect = BpMultiSelect.ofType<InternalItem>();

	const component: FC<IMultiSelectProps<T, TOriginal>> = memo(
		({
			className,
			disabled = false,
			itemInfo,
			itemKey = (value: TOriginal) => get(value, "key") ?? toString(value),
			itemMap = {
				from: (value: any) => value,
				to: (value: any) => value
			},
			itemName = (value: TOriginal) => get(value, "key") ?? toString(value),
			itemPredicate,
			itemRenderer: _itemRenderer = DefaultItemRenderer,
			items: _items,
			minimal,
			noResults = <Menu.Item disabled={true} text="No results." />,
			onItemRemove: _onItemRemove,
			onItemsClear,
			onItemSelect: _onItemSelect,
			onQueryChange,
			query,
			queryPlaceholder,
			resetOnQuery,
			resetOnSelect,
			selectedItems: _selectedItems,
			usePortal = true
		}) => {
			const classes = useStyles();

			const itemDisabled = useCallback(() => disabled, [disabled]);

			const itemsEqual = useCallback(
				(itemA: InternalItem, itemB: InternalItem) => itemA.key === itemB.key,
				[]
			);

			const itemRenderer: ItemRenderer<InternalItem> = useCallback(
				(item: InternalItem, rendererProps) => {
					const Item = _itemRenderer;

					const isSelected: boolean =
						(_selectedItems ?? [])
							.map((selectedItem) => {
								return itemKey(itemMap.to(selectedItem));
							})
							.findIndex((key) => key === item.key) !== -1;

					return (
						<Item
							key={item.key}
							isSelected={isSelected}
							item={item}
							rendererProps={rendererProps}
						/>
					);
				},
				[_itemRenderer, _selectedItems, itemKey, itemMap]
			);

			const toInternalItem = useCallback(
				(value: TOriginal): InternalItem => {
					const info = itemInfo?.(value);
					const key = itemKey(value);
					const name = itemName(value);

					return { key, info, name, value };
				},
				[itemInfo, itemKey, itemName]
			);

			const items: InternalItem[] = useMemo(() => _items.map(toInternalItem), [
				_items,
				toInternalItem
			]);

			const selectedItems: InternalItem[] | undefined = useMemo(
				() => _selectedItems?.map((item) => toInternalItem(itemMap.to(item))),
				[_selectedItems, itemMap, toInternalItem]
			);

			const onItemRemove = useCallback(
				(name: string) => {
					const newItems: readonly T[] = (selectedItems ?? [])
						.filter((item) => item.name !== name)
						.map(({ value }) => itemMap.from(value));

					const original: TOriginal | undefined = (selectedItems ?? []).find(
						(item) => item.name === name
					)?.value;
					const removedItem: T | undefined = original && itemMap.from(original);

					_onItemRemove?.(newItems, removedItem);
				},
				[_onItemRemove, itemMap, selectedItems]
			);

			const onItemSelect = useCallback(
				(item: InternalItem, e) => _onItemSelect(itemMap.from(item.value), e),
				[_onItemSelect, itemMap]
			);

			const popoverProps: Partial<IPopoverProps> = useMemo(
				() => ({
					minimal,
					usePortal
				}),
				[minimal, usePortal]
			);

			const tagInputProps: Partial<ITagInputProps> = useMemo(
				() => ({
					onRemove: onItemRemove,
					rightElement: (selectedItems ?? []).length ? (
						<Button icon="cross" minimal={true} onClick={onItemsClear} />
					) : undefined,
					tagProps: { minimal }
				}),
				[minimal, onItemRemove, onItemsClear, selectedItems]
			);
			const tagRenderer = useCallback((item: InternalItem) => item.name, []);

			return (
				<TypedMultiSelect
					className={classnames(classes.root, Classes.DARK, className)}
					activeItem={null}
					itemDisabled={itemDisabled}
					itemPredicate={itemPredicate}
					itemRenderer={itemRenderer}
					items={items}
					itemsEqual={itemsEqual}
					noResults={noResults}
					onItemSelect={onItemSelect}
					onQueryChange={onQueryChange}
					placeholder={queryPlaceholder}
					popoverProps={popoverProps}
					query={query}
					resetOnQuery={resetOnQuery}
					resetOnSelect={resetOnSelect}
					selectedItems={selectedItems}
					tagInputProps={tagInputProps}
					tagRenderer={tagRenderer}
				/>
			);
		}
	);

	component.displayName = "TypedMultiSelect";

	return component;
};

const _MultiSelect: FC<IMultiSelectProps<any>> = ofType<any>();
_MultiSelect.displayName = "MultiSelect";

(_MultiSelect as FC<IMultiSelectProps<any>> & IWithStaticExports).ofType = ofType;

export const MultiSelect = _MultiSelect as FC<IMultiSelectProps<any>> & IWithStaticExports;
