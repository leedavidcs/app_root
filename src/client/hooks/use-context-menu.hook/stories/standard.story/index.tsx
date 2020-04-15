import { Paper } from "@/client/components";
import { useContextMenu } from "@/client/hooks";
import { Classes, Menu } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC } from "react";
import { useStyles } from "./styles";

export const StandardStory: FC = () => {
	const classes = useStyles();

	const [onContextMenu] = useContextMenu(
		<Menu>
			<Menu.Item icon="badge" text="Branch" />
			<Menu.Item icon="badge" text="Commit" />
			<Menu.Item icon="badge" text="Merge" />
			<Menu.Item icon="badge" text="New branch" />
			<Menu.Item icon="badge" text="Pull" />
		</Menu>
	);

	return (
		<Paper
			className={classnames(classes.root, Classes.CONTEXT_MENU_POPOVER_TARGET)}
			onContextMenu={onContextMenu}
		/>
	);
};
