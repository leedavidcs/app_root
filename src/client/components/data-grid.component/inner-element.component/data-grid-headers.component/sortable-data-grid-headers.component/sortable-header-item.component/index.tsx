import {
	HeadersContext,
	IHeaderConfig,
	IHeaderOption,
	ResizeContext
} from "@/client/components/data-grid.component";
import { Select } from "@/client/components/input.component";
import React, { FC, memo, useCallback, useContext } from "react";
import { SortableElement, SortableElementProps } from "react-sortable-hoc";
import { HeaderItem } from "./header-item.component";
import { useStyles } from "./styles";
import { useHeaderMenu } from "./use-header-menu.hook";

export interface IBaseHeaderItemProps extends IHeaderConfig {
	headerIndex: number;
	onOpenMenu: () => void;
	onOpenOptions: () => void;
	onEdit: (index: number) => void;
}

const TypedSelect = Select.ofType<IHeaderOption>();

const useOnSelect = (index: number) => {
	const { setHeaderOption } = useContext(HeadersContext);

	return useCallback((option: IHeaderOption) => setHeaderOption(option, index), [
		index,
		setHeaderOption
	]);
};

const BaseHeaderItem: FC<IBaseHeaderItemProps> = memo((props: IBaseHeaderItemProps) => {
	const {
		headerIndex: index,
		onOpenMenu,
		onOpenOptions,
		onEdit: _onEdit,
		...headerProps
	} = props;
	const { editable = true, options, width } = headerProps;

	const classes = useStyles();

	const { isResizing } = useContext(ResizeContext);

	const onSelect = useOnSelect(index);

	const [onContextMenu, { isOpen }] = useHeaderMenu(props);

	const itemKey = useCallback((option: IHeaderOption) => option.label, []);
	const itemName = useCallback((option: IHeaderOption) => option.label, []);

	return (
		<div
			className={classes.root}
			onContextMenu={onContextMenu}
			style={{ width, minWidth: width }}
		>
			<TypedSelect
				disabled={!editable || isResizing || isOpen}
				itemKey={itemKey}
				itemName={itemName}
				items={options ?? []}
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

const SortableHeaderItemComponent = SortableElement<IBaseHeaderItemProps>(BaseHeaderItem);

export const SortableHeaderItem: FC<IBaseHeaderItemProps & SortableElementProps> = memo((props) => {
	const { disabled } = props;

	const ComponentType = disabled ? BaseHeaderItem : SortableHeaderItemComponent;

	return <ComponentType {...props} />;
});

SortableHeaderItem.displayName = "SortableHeaderItem";
