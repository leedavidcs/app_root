import { Classes, IInputGroupProps, IPopoverProps, Menu } from "@blueprintjs/core";
import { ItemPredicate, ItemRenderer, Select as BpSelect } from "@blueprintjs/select";
import classnames from "classnames";
import { get, toString } from "lodash";
import React, {
	ChangeEvent,
	FC,
	memo,
	ReactElement,
	ReactNode,
	ReactText,
	SyntheticEvent,
	useCallback,
	useMemo
} from "react";
import Highlighter from "react-highlight-words";
import { useStyles } from "./styles";

interface ISelectItemType<T = any> {
	key: ReactText;
	name: ReactText;
	value: T;
}

export interface ISelectProps<T> {
	activeItem?: Maybe<T>;
	children: ReactElement;
	className?: string;
	disabled?: boolean;
	filterable?: boolean;
	itemPredicate?: ItemPredicate<ISelectItemType<T>>;
	itemRenderer?: ItemRenderer<ISelectItemType<T>>;
	itemKey?: (item: T) => ReactText;
	itemName?: (item: T) => ReactText;
	items: readonly T[];
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
	ofType: <T extends any>() => FC<ISelectProps<T>>;
}

const getDefaultRenderer = <T extends ISelectItemType>(): ItemRenderer<T> => (
	item,
	{ handleClick, modifiers, query }
) => (
	<Menu.Item
		key={item.key}
		active={modifiers.active}
		disabled={modifiers.disabled}
		onClick={handleClick}
		text={
			<Highlighter
				autoEscape={true}
				highlightTag={({ children }) => <strong>{children}</strong>}
				searchWords={[query]}
				textToHighlight={item.name.toString()}
			/>
		}
	/>
);

const ofType = <T extends any>() => {
	type InternalItem = ISelectItemType<T>;

	const TypedSelect = BpSelect.ofType<InternalItem>();

	const component: FC<ISelectProps<T>> = memo(
		({
			activeItem: _activeItem,
			children,
			className,
			disabled,
			filterable,
			itemPredicate,
			itemRenderer = getDefaultRenderer<InternalItem>(),
			itemKey = (value: T) => get(value, "key") ?? toString(value),
			itemName = (value: T) => get(value, "key") ?? toString(value),
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

			const toInternalItem = useCallback(
				(value: T): InternalItem => {
					const key = itemKey(value);
					const name = itemName(value);

					return { key, name, value };
				},
				[itemKey, itemName]
			);

			const items: InternalItem[] = useMemo(() => _items.map(toInternalItem), [
				_items,
				toInternalItem
			]);

			const activeItem = useMemo(
				() => _activeItem && items.find(({ key }) => key === itemKey(_activeItem)),
				[_activeItem, itemKey, items]
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

			const onItemSelect = useCallback((item: InternalItem) => _onItemSelect(item.value), [
				_onItemSelect
			]);

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
