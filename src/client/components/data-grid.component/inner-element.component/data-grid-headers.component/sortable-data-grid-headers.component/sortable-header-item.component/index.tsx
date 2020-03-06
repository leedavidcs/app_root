import { IHeaderConfig } from "@/client/components/data-grid.component";
import { Tooltip } from "@/client/components/tooltip.component";
import { useContextMenu } from "@/client/hooks";
import { Menu } from "@blueprintjs/core";
import { codes } from "keycode";
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

const BaseHeaderItemComponent: FC<IProps> = memo((props: IProps) => {
	const { headerIndex: index, ...headerProps } = props;
	const { options, value, width } = headerProps;

	const classes = useStyles();

	const {
		inputValue,
		isEditing,
		setInputValue,
		startEditing,
		stopEditing,
		updateLabel
	} = useEditActions(index);
	const { freezeAction, freezeActionLabel } = useFreezeActions(index);
	const { closeSelect, openSelect, isSelected, selectOption } = useSelectActions(index);

	const stopOperations = useCallback(() => {
		closeSelect();
		stopEditing();
	}, [closeSelect, stopEditing]);

	const onInputChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value),
		[setInputValue]
	);

	const onInputKeyDown = useCallback(
		({ keyCode }: KeyboardEvent<HTMLInputElement>) => {
			switch (keyCode) {
				case codes.esc:
					stopEditing();
					break;
				case codes.enter:
					updateLabel();
					stopEditing();
					break;
				default:
			}
		},
		[stopEditing, updateLabel]
	);

	const [onContextMenu] = useContextMenu(
		<Menu className={classes.contextMenu}>
			<Menu.Item icon="edit" text="Edit label" onClick={startEditing} />
			<Menu.Item text={freezeActionLabel} onClick={freezeAction} />
		</Menu>,
		{ onOpen: stopOperations }
	);

	return (
		<Tooltip
			active={isSelected}
			direction="bottom-start"
			onMouseDownOut={stopOperations}
			style={{ width }}
			tooltip={<HeaderSelect onSelect={selectOption} options={options} value={value} />}
		>
			<div onContextMenu={onContextMenu}>
				{isEditing ? (
					<input
						className={classes.editLabel}
						value={inputValue}
						onChange={onInputChange}
						onKeyDown={onInputKeyDown}
						autoFocus={true}
						spellCheck={false}
					/>
				) : (
					<HeaderItem index={index} onClick={openSelect} {...headerProps} />
				)}
			</div>
		</Tooltip>
	);
});

BaseHeaderItemComponent.displayName = "BaseHeaderItemComponent";

const SortableHeaderItemComponent = SortableElement<IProps>(BaseHeaderItemComponent);

export const SortableHeaderItem: FC<IProps & SortableElementProps> = memo((props) => {
	const { disabled } = props;

	const ComponentType = disabled ? BaseHeaderItemComponent : SortableHeaderItemComponent;

	return <ComponentType {...props} />;
});

SortableHeaderItem.displayName = "SortableHeaderItem";
