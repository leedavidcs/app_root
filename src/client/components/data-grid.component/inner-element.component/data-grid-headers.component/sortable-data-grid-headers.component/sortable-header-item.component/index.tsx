import { ClickOutside } from "@/client/components/click-outside.component";
import { IHeaderConfig } from "@/client/components/data-grid.component";
import { Popover } from "@/client/components/popover.component";
import { useContextMenu, useKeyDown } from "@/client/hooks";
import { Menu } from "@blueprintjs/core";
import React, { ChangeEvent, FC, KeyboardEvent, memo, useCallback } from "react";
import { SortableElement, SortableElementProps } from "react-sortable-hoc";
import { HeaderItem } from "./header-item.component";
import { HeaderSelect } from "./header-select.component";
import { useStyles } from "./styles";
import { useEditActions } from "./use-edit-actions.hook";
import { useFreezeActions } from "./use-freeze-actions.hook";
import { useSelectActions } from "./use-select-actions.hook";

interface IProps extends IHeaderConfig {
	headerIndex: number;
}

const BaseHeaderItem: FC<IProps> = memo((props: IProps) => {
	const { headerIndex: index, ...headerProps } = props;
	const { options, value, width } = headerProps;

	const classes = useStyles();

	const [editStates, editActions] = useEditActions(index);
	const [freezeLabel, freezeActions] = useFreezeActions(index);
	const [isSelected, selectActions] = useSelectActions(index);

	const stopOperations = useCallback(() => {
		selectActions.close();
		editActions.stop();
	}, [editActions, selectActions]);

	const onInputChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => editActions.setValue(event.target.value),
		[editActions]
	);

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

	const [onContextMenu] = useContextMenu(
		<Menu className={classes.contextMenu}>
			<Menu.Item icon="edit" text="Edit label" onClick={editActions.start} />
			<Menu.Item text={freezeLabel} onClick={freezeActions.freeze} />
		</Menu>,
		{ onOpen: stopOperations }
	);

	return (
		<ClickOutside onClick={stopOperations}>
			<Popover
				isOpen={isSelected}
				minimal={true}
				position="bottom-left"
				onClose={stopOperations}
				content={
					<HeaderSelect onSelect={selectActions.select} options={options} value={value} />
				}
			>
				<div onContextMenu={onContextMenu} style={{ height: "100%", width }}>
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
						<HeaderItem index={index} onClick={selectActions.open} {...headerProps} />
					)}
				</div>
			</Popover>
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
