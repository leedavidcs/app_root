import { ClickOutside } from "@/client/components/click-outside.component";
import {
	HeadersContext,
	IHeaderConfig,
	IHeaderOption,
	ResizeContext
} from "@/client/components/data-grid.component";
import { ISelectItemType, Select } from "@/client/components/input.component";
import { useContextMenu, useKeyDown } from "@/client/hooks";
import { Menu } from "@blueprintjs/core";
import React, {
	ChangeEvent,
	FC,
	KeyboardEvent,
	memo,
	useCallback,
	useContext,
	useMemo
} from "react";
import { SortableElement, SortableElementProps } from "react-sortable-hoc";
import { HeaderItem } from "./header-item.component";
import { useStyles } from "./styles";
import { IEditActions, useEditActions } from "./use-edit-actions.hook";
import { useFreezeActions } from "./use-freeze-actions.hook";

interface IProps extends IHeaderConfig {
	headerIndex: number;
}

const useOnInputKeyDown = (editActions: IEditActions) => {
	const onEscKey = useKeyDown("esc", editActions.stop);
	const onEnterKey = useKeyDown(
		"enter",
		useCallback(() => {
			editActions.updateLabel();
			editActions.stop();
		}, [editActions])
	);

	const onInputKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			onEscKey(event);
			onEnterKey(event);
		},
		[onEnterKey, onEscKey]
	);

	return onInputKeyDown;
};

const TypedSelect = Select.ofType<IHeaderOption & ISelectItemType>();

const useOptionItems = ({ options }: IProps) => {
	const selectOptions: readonly (IHeaderOption & ISelectItemType)[] = useMemo(
		() =>
			(options ?? [])?.map((option) => ({
				...option,
				key: option.value
			})),
		[options]
	);

	return selectOptions;
};

const useOnSelect = (index: number) => {
	const { setHeaderOption } = useContext(HeadersContext);

	return useCallback((option: IHeaderOption) => setHeaderOption(option, index), [
		index,
		setHeaderOption
	]);
};

const BaseHeaderItem: FC<IProps> = memo((props: IProps) => {
	const { headerIndex: index, ...headerProps } = props;
	const { width } = headerProps;

	const classes = useStyles();

	const { isResizing } = useContext(ResizeContext);

	const [editStates, editActions] = useEditActions(index);
	const [freezeLabel, freezeActions] = useFreezeActions(index);
	const onSelect = useOnSelect(index);

	const onInputChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => editActions.setValue(event.target.value),
		[editActions]
	);

	const onInputKeyDown = useOnInputKeyDown(editActions);

	const [onContextMenu, { isOpen: isContextMenuOpen }] = useContextMenu(
		<Menu className={classes.contextMenu}>
			<Menu.Item icon="edit" text="Edit label" onClick={editActions.start} />
			<Menu.Item text={freezeLabel} onClick={freezeActions.freeze} />
			<Menu.Item icon="trash" text="Delete column" />
		</Menu>,
		{ onOpen: editActions.stop }
	);

	const items = useOptionItems(props);

	return (
		<ClickOutside onClick={editActions.stop}>
			<div
				className={classes.root}
				onContextMenu={onContextMenu}
				style={{ width, minWidth: width }}
			>
				<TypedSelect
					disabled={isResizing || isContextMenuOpen || editStates.isEditing}
					items={items}
					minimal={true}
					onItemSelect={onSelect}
				>
					{editStates.isEditing ? (
						<input
							className={classes.editLabel}
							value={editStates.value}
							onChange={onInputChange}
							onKeyDown={onInputKeyDown}
							autoFocus={true}
							spellCheck={false}
						/>
					) : (
						<HeaderItem index={index} {...headerProps} />
					)}
				</TypedSelect>
			</div>
		</ClickOutside>
	);
});

BaseHeaderItem.displayName = "BaseHeaderItem";

const SortableHeaderItemComponent = SortableElement<IProps>(BaseHeaderItem);

export const SortableHeaderItem: FC<IProps & SortableElementProps> = memo((props) => {
	const { disabled } = props;

	const ComponentType = disabled ? BaseHeaderItem : SortableHeaderItemComponent;

	return <ComponentType {...props} />;
});

SortableHeaderItem.displayName = "SortableHeaderItem";
