import { IBaseHeaderItemProps } from "@/client/components/data-grid.component";
import { useContextMenu } from "@/client/hooks";
import { Menu } from "@blueprintjs/core";
import React, { useCallback } from "react";
import { useStyles } from "./styles";
import { useFreezeActions } from "./use-freeze-actions.hook";

export const useHeaderMenu = ({ headerIndex: index, onEdit: _onEdit }: IBaseHeaderItemProps) => {
	const classes = useStyles();

	const onEdit = useCallback(() => _onEdit(index), [_onEdit, index]);

	const [freezeLabel, freezeActions] = useFreezeActions(index);

	return useContextMenu(
		<Menu className={classes.root}>
			<Menu.Item icon="edit" text="Edit label" onClick={onEdit} />
			<Menu.Item text={freezeLabel} onClick={freezeActions.freeze} />
			<Menu.Item icon="trash" text="Delete column" />
		</Menu>,
		{}
	);
};
