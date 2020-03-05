import { ContextMenu } from "@/client/components/context-menu.component";
import { Paper } from "@/client/components/paper.component";
import { action } from "@storybook/addon-actions";
import React, { useCallback } from "react";
import { useStyles } from "./styles";

const MENU_SIZE = 120;
const PAPER_SIZE = 200;

export const StandardStory = () => {
	const classes = useStyles({ menuSize: MENU_SIZE, clickAreaSize: PAPER_SIZE });

	const onClose0 = useCallback(action("onClose0"), []);
	const onClose1 = useCallback(action("onClose1"), []);
	const onOpen0 = useCallback(action("onOpen0"), []);
	const onOpen1 = useCallback(action("onOpen1"), []);

	return (
		<div className={classes.root}>
			<div className={classes.wrapper}>
				<ContextMenu
					menu={<div className={classes.menu1} />}
					onClose={onClose0}
					onOpen={onOpen0}
				>
					<Paper>
						<div className={classes.clickArea} />
					</Paper>
				</ContextMenu>
			</div>
			<div className={classes.wrapper}>
				<ContextMenu
					menu={<div className={classes.menu2} />}
					onClose={onClose1}
					onOpen={onOpen1}
				>
					<Paper>
						<div className={classes.clickArea} />
					</Paper>
				</ContextMenu>
			</div>
		</div>
	);
};
