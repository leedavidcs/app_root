import { ContextMenu } from "@/client/components/context-menu.component";
import { IHeaderConfig } from "@/client/components/data-grid.component";
import { Tooltip } from "@/client/components/tooltip.component";
import { codes } from "keycode";
import React, { ChangeEvent, FC, KeyboardEvent, memo, useCallback, useMemo } from "react";
import { SortableElement, SortableElementProps } from "react-sortable-hoc";
import { HeaderItem } from "./header-item.component";
import { HeaderMenu, IOption } from "./header-menu.component";
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

	const menuOptions: readonly IOption[] = useMemo(
		() => [
			{ text: "Edit label", handler: startEditing },
			{ text: freezeActionLabel, handler: freezeAction }
		],
		[freezeAction, freezeActionLabel, startEditing]
	);

	return (
		<Tooltip
			active={isSelected}
			direction="bottom-start"
			onMouseDownOut={stopOperations}
			style={{ width }}
			tooltip={<HeaderSelect onSelect={selectOption} options={options} value={value} />}
		>
			<ContextMenu menu={<HeaderMenu options={menuOptions} />} onOpen={stopOperations}>
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
			</ContextMenu>
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
