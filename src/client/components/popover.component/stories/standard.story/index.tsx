import { Button } from "@/client/components/button.component";
import { Menu } from "@/client/components/menu.component";
import { Popover } from "@/client/components/popover.component";
import { boolean } from "@storybook/addon-knobs";
import React, { FC, useCallback, useState } from "react";

export const StandardStory: FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onClick = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen]);

	const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);

	return (
		<Popover
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
			<Button
				onClick={onClick}
				intent="primary"
				style={{ display: "inline-block" }}
				text="Toggle"
			/>
		</Popover>
	);
};
