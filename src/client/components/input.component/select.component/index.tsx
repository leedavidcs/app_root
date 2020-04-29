import { Classes, IInputGroupProps, IPopoverProps, Menu } from "@blueprintjs/core";
import { ItemPredicate, ItemRenderer, Select as BpSelect } from "@blueprintjs/select";
import classnames from "classnames";
import { get, toString } from "lodash";
import React, {
	ChangeEvent,
	ComponentType,
	FC,
	memo,
	ReactElement,
	ReactNode,
	ReactText,
	SyntheticEvent,
	useCallback,
	useMemo
} from "react";
import { DefaultItemRenderer, IItemProps } from "./default-item-renderer.component";
import { useStyles } from "./styles";

export interface ISelectItemType<T = any> {
	info: ReactNode;
	key: ReactText;
	name: ReactText;
	value: T;
}

export interface ISelectProps<T, TOriginal = T> {
	activeItem?: Maybe<T>;
	children: ReactElement;
	className?: string;
	disabled?: boolean;
	filterable?: boolean;
	itemInfo?: (item: TOriginal) => ReactNode;
	itemKey?: (item: TOriginal) => ReactText;
	itemMap?: {
		from: (original: TOriginal) => T;
		to: (to: T) => TOriginal;
	};
	itemName?: (item: TOriginal) => ReactText;
	itemPredicate?: ItemPredicate<ISelectItemType<TOriginal>>;
	itemRenderer?: ComponentType<IItemProps<TOriginal>>;
	items: readonly TOriginal[];
	minimal?: boolean;
	noResults?: ReactNode;
	onItemSelect: (item: T, event?: SyntheticEvent<HTMLElement>) => void;
	onOpened?: (node: HTMLElement) => void;
	onOpening?: (node: HTMLElement) => void;
	onQueryChange?: (query: string, event?: ChangeEvent<HTMLInputElement>) => void;
	query?: string;
	queryPlaceholder?: string;
	resetOnClose?: boolean;
	resetOnQuery?: boolean;
	resetOnSelect?: boolean;
	usePortal?: boolean;
}

interface IWithStaticExports {
	ofType: <T extends any, TOriginal = T>() => FC<ISelectProps<T, TOriginal>>;
}

const ofType = <T extends any, TOriginal = T>() => {
	type InternalItem = ISelectItemType<TOriginal>;

	const TypedSelect = BpSelect.ofType<InternalItem>();

	const component: FC<ISelectProps<T, TOriginal>> = memo(
		({
			activeItem: _activeItem,
			children,
			className,
			disabled,
			filterable,
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
			onItemSelect: _onItemSelect,
			onOpened,
			onOpening,
			onQueryChange,
			query,
			queryPlaceholder,
			resetOnClose,
			resetOnQuery,
			resetOnSelect,
			usePortal = true
		}) => {
			useStyles();

			const itemRenderer: ItemRenderer<InternalItem> = useCallback(
				(item: InternalItem, rendererProps) => {
					const Item = _itemRenderer;

					return <Item key={item.key} item={item} rendererProps={rendererProps} />;
				},
				[_itemRenderer]
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

			const activeItem = useMemo(
				() =>
					_activeItem &&
					items.find(({ key }) => key === itemKey(itemMap.to(_activeItem))),
				[_activeItem, itemKey, itemMap, items]
			);

			const inputProps: Partial<IInputGroupProps> = useMemo(
				() => ({
					placeholder: queryPlaceholder
				}),
				[queryPlaceholder]
			);

			const popoverProps: Partial<IPopoverProps> = useMemo(
				() => ({
					minimal,
					onOpened,
					onOpening,
					usePortal
				}),
				[minimal, onOpened, onOpening, usePortal]
			);

			const onItemSelect = useCallback(
				(item: InternalItem) => _onItemSelect(itemMap.from(item.value)),
				[_onItemSelect, itemMap]
			);

			return (
				<TypedSelect
					activeItem={activeItem}
					className={classnames(Classes.DARK, className)}
					disabled={disabled}
					filterable={filterable}
					inputProps={inputProps}
					itemPredicate={itemPredicate}
					itemRenderer={itemRenderer}
					items={items}
					noResults={noResults}
					onItemSelect={onItemSelect}
					onQueryChange={onQueryChange}
					popoverProps={popoverProps}
					query={query}
					resetOnClose={resetOnClose}
					resetOnQuery={resetOnQuery}
					resetOnSelect={resetOnSelect}
				>
					{children}
				</TypedSelect>
			);
		}
	);

	component.displayName = "TypedSelect";

	return component;
};

const _Select: FC<ISelectProps<any>> = ofType<any>();
_Select.displayName = "Select";

(_Select as FC<ISelectProps<any>> & IWithStaticExports).ofType = ofType;

export const Select = _Select as FC<ISelectProps<any>> & IWithStaticExports;
