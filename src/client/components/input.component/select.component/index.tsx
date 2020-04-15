import { Classes, IInputGroupProps, IPopoverProps, Menu } from "@blueprintjs/core";
import { ItemPredicate, ItemRenderer, Select as BpSelect } from "@blueprintjs/select";
import classnames from "classnames";
import React, {
	ChangeEvent,
	FC,
	memo,
	ReactElement,
	ReactNode,
	SyntheticEvent,
	useMemo
} from "react";
import Highlighter from "react-highlight-words";
import { useStyles } from "./styles";

export interface ISelectItemType {
	key: string | number;
	[key: string]: any;
}

export interface ISelectProps<T extends ISelectItemType> {
	activeItem?: Maybe<T>;
	children: ReactElement;
	className?: string;
	disabled?: boolean;
	filterable?: boolean;
	itemPredicate?: ItemPredicate<T>;
	itemRenderer?: ItemRenderer<T>;
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
	ofType: <T extends ISelectItemType>() => FC<ISelectProps<T>>;
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
				textToHighlight={item.key.toString()}
			/>
		}
	/>
);

const ofType = <T extends ISelectItemType>() => {
	const TypedSelect = BpSelect.ofType<T>();

	const component: FC<ISelectProps<T>> = memo(
		({
			activeItem,
			children,
			className,
			disabled,
			filterable,
			itemPredicate,
			itemRenderer = getDefaultRenderer<T>(),
			items,
			minimal,
			noResults = <Menu.Item disabled={true} text="No results." />,
			onItemSelect,
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

			return (
				<TypedSelect
					activeItem={activeItem}
					className={classnames(Classes.DARK, className)}
					disabled={disabled}
					filterable={filterable}
					inputProps={inputProps}
					itemPredicate={itemPredicate}
					itemRenderer={itemRenderer}
					items={items as T[]}
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
