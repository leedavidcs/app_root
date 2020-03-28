import { IBaseHeaderItemProps } from "@/client/components/data-grid.component";
import { useContextMenu } from "@/client/hooks";
import { Menu } from "@blueprintjs/core";
import React, { useCallback } from "react";
import { useStyles } from "./styles";
import { useFreezeActions } from "./use-freeze-actions.hook";
import { useOnDelete } from "./use-on-delete.hook";

export const useHeaderMenu = ({
	editable = true,
	headerIndex: index,
	onEdit: _onEdit,
	onOpenMenu
}: IBaseHeaderItemProps) => {
	const classes = useStyles();

	const onEdit = useCallback(() => _onEdit(index), [_onEdit, index]);

	const [freezeLabel, freezeActions] = useFreezeActions(index);
	const onDelete = useOnDelete(index);

	return useContextMenu(
		<Menu className={classes.root}>
			<Menu.Item icon="edit" text="Edit label" onClick={onEdit} />
			<Menu.Item icon="blank" text={freezeLabel} onClick={freezeActions.freeze} />
			<Menu.Item icon="trash" text="Delete column" onClick={onDelete} />
		</Menu>,
		{ disabled: !editable, onOpen: onOpenMenu }
	);
};
