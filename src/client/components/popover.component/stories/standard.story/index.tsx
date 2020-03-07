import { Popover } from "@/client/components/popover.component";
import { Button, Menu } from "@blueprintjs/core";
import { boolean } from "@storybook/addon-knobs";
import React, { FC, useCallback, useState } from "react";
import { useStyles } from "./styles";

export const StandardStory: FC = () => {
	const classes = useStyles();

	const [isOpen, setIsOpen] = useState(false);

	const onClick = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen]);

	const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);

	return (
		<Popover
			className={classes.root}
			arrow={boolean("arrow", false)}
			isOpen={isOpen}
			onClose={onClose}
			position="bottom-left"
			content={
				<Menu>
					<Menu.Item text="Banana" />
					<Menu.Item text="Apple" />
				</Menu>
			}
		>
			<Button onClick={onClick} intent="primary" style={{ display: "inline-block" }}>
				Toggle
			</Button>
		</Popover>
	);
};
