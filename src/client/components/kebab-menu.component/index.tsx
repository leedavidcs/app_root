import { List, ListItem, ListItemText } from "@/client/components/list.component";
import { Overlay } from "@/client/components/overlay.component";
import { Popover } from "@/client/components/popover.component";
import { useHover, useTheme } from "@/client/hooks";
import classnames from "classnames";
import React, { FC, MouseEvent, ReactElement, useCallback, useMemo, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
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

	const [isHovered, hoverRef] = useHover<HTMLDivElement>(false, { stopPropagation: true });

	const onOptionClick = useCallback(
		(option: IKebabMenuOption) => (event: MouseEvent<HTMLElement>) => {
			event.stopPropagation();
			option.onClick();
		},
		[]
	);

	const tooltip: ReactElement = useMemo(
		() => (
			<List>
				{options.map((option) => (
					<ListItem key={option.text} selected={false} onClick={onOptionClick(option)}>
						<ListItemText primary={option.text} />
					</ListItem>
				))}
			</List>
		),
		[onOptionClick, options]
	);

	const onClick = useCallback(
		(event: MouseEvent<HTMLDivElement>) => {
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
			<div ref={hoverRef} className={classnames(classes.root, className)} onClick={onClick}>
				<FaEllipsisV />
				<Overlay
					active={isOpen || isHovered}
					opacity={isOpen ? theme.surfaceOverlayFocused : theme.surfaceOverlayHovered}
				/>
			</div>
		</Popover>
	);
};
