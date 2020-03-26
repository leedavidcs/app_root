import {
	HeadersContext,
	IHeaderConfig,
	IHeaderOption,
	ResizeContext
} from "@/client/components/data-grid.component";
import { ISelectItemType, Select } from "@/client/components/input.component";
import { useContextMenu } from "@/client/hooks";
import { Menu } from "@blueprintjs/core";
import React, { FC, memo, useCallback, useContext, useMemo } from "react";
import { SortableElement, SortableElementProps } from "react-sortable-hoc";
import { HeaderItem } from "./header-item.component";
import { useStyles } from "./styles";
import { useFreezeActions } from "./use-freeze-actions.hook";

interface IProps extends IHeaderConfig {
	headerIndex: number;
	onOpenMenu: () => void;
	onOpenOptions: () => void;
	onEdit: (index: number) => void;
}

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
	const {
		headerIndex: index,
		onOpenMenu,
		onOpenOptions,
		onEdit: _onEdit,
		...headerProps
	} = props;
	const { width } = headerProps;

	const classes = useStyles();

	const { isResizing } = useContext(ResizeContext);

	const [freezeLabel, freezeActions] = useFreezeActions(index);
	const onSelect = useOnSelect(index);

	const onEdit = useCallback(() => _onEdit(index), [_onEdit, index]);

	const [onContextMenu, { isOpen: isContextMenuOpen }] = useContextMenu(
		<Menu className={classes.contextMenu}>
			<Menu.Item icon="edit" text="Edit label" onClick={onEdit} />
			<Menu.Item text={freezeLabel} onClick={freezeActions.freeze} />
			<Menu.Item icon="trash" text="Delete column" />
		</Menu>,
		{ onOpen: onOpenMenu }
	);

	const items = useOptionItems(props);

	return (
		<div
			className={classes.root}
			onContextMenu={onContextMenu}
			style={{ width, minWidth: width }}
		>
			<TypedSelect
				disabled={isResizing || isContextMenuOpen}
				items={items}
				minimal={true}
				onItemSelect={onSelect}
				onOpening={onOpenOptions}
			>
				<HeaderItem index={index} {...headerProps} />
			</TypedSelect>
		</div>
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
