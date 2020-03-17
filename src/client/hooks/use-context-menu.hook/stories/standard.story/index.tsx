import { Paper } from "@/client/components";
import { useContextMenu } from "@/client/hooks";
import { Classes, Menu } from "@blueprintjs/core/lib/esm";
import classnames from "classnames";
import React, { FC } from "react";
import { useStyles } from "./styles";

export const StandardStory: FC = () => {
	const classes = useStyles();

	const [onContextMenu] = useContextMenu(
		<Menu>
			<Menu.Item icon="git-branch" text="Branch" />
			<Menu.Item icon="git-commit" text="Commit" />
			<Menu.Item icon="git-merge" text="Merge" />
			<Menu.Item icon="git-new-branch" text="New branch" />
			<Menu.Item icon="git-pull" text="Pull" />
		</Menu>
	);

	return (
		<Paper
			className={classnames(classes.root, Classes.CONTEXT_MENU_POPOVER_TARGET)}
			onContextMenu={onContextMenu}
		/>
	);
};
