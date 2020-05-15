import { Button } from "@/client/components/button.component";
import { Menu } from "@/client/components/menu.component";
import { Tooltip } from "@/client/components/tooltip.component";
import { boolean } from "@storybook/addon-knobs";
import React, { FC, useCallback, useState } from "react";

export const StandardStory: FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onInteraction = useCallback((nextState: boolean) => setIsOpen(nextState), [setIsOpen]);

	const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);

	return (
		<Tooltip
			arrow={boolean("arrow", true)}
			isOpen={isOpen}
			onClose={onClose}
			onInteraction={onInteraction}
			position="bottom-left"
			content={
				<Menu>
					<Menu.Item text="Banana" />
					<Menu.Item text="Apple" />
				</Menu>
			}
		>
			<Button intent="primary" text="Toggle" />
		</Tooltip>
	);
};
