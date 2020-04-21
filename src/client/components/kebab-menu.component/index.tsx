import { Overlay } from "@/client/components/overlay.component";
import { Popover } from "@/client/components/popover.component";
import { useHover, useTheme } from "@/client/hooks";
import { Icon, Menu } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, MouseEvent, ReactElement, useCallback, useMemo, useState } from "react";
import { useStyles } from "./styles";

export interface IKebabMenuOption {
	text: string;
	onClick: () => void;
}

const DEFAULT_SIZE = 30;

interface IProps {
	className?: string;
	options: readonly IKebabMenuOption[];
	size?: number;
}

export const KebabMenu: FC<IProps> = ({ className, options, size = DEFAULT_SIZE }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const classes = useStyles({ size });
	const { theme } = useTheme();

	const [isHovered, hoverResult] = useHover<HTMLDivElement>(false, { stopPropagation: true });

	const onOptionClick = useCallback(
		(option: IKebabMenuOption) => (event: MouseEvent<HTMLElement>) => {
			event.stopPropagation();
			option.onClick();
		},
		[]
	);

	const tooltip: ReactElement = useMemo(
		() => (
			<Menu>
				{options.map((option) => (
					<Menu.Item
						key={option.text}
						onClick={onOptionClick(option)}
						text={option.text}
					/>
				))}
			</Menu>
		),
		[onOptionClick, options]
	);

	const onClick = useCallback(
		(event: MouseEvent<HTMLDivElement>) => {
			event.preventDefault();
			event.stopPropagation();

			setIsOpen(true);
		},
		[setIsOpen]
	);

	const onClickOut = useCallback(() => setIsOpen(false), [setIsOpen]);

	return (
		<Popover
			popoverClassName={classes.menu}
			isOpen={isOpen}
			position="bottom-left"
			onClose={onClickOut}
			content={tooltip}
		>
			<div
				ref={hoverResult.ref}
				className={classnames(classes.root, className)}
				onClick={onClick}
			>
				<Icon icon="more" />
				<Overlay
					active={isOpen || isHovered}
					opacity={isOpen ? theme.surfaceOverlayFocused : theme.surfaceOverlayHovered}
				/>
			</div>
		</Popover>
	);
};
