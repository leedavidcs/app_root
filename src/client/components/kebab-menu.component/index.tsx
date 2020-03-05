import { List, ListItem, ListItemText } from "@/client/components/list.component";
import { Overlay } from "@/client/components/overlay.component";
import { Tooltip } from "@/client/components/tooltip.component";
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
	const [active, setActive] = useState<boolean>(false);

	const classes = useStyles({ size });
	const { theme } = useTheme();

	const [isHovered, hoverRef] = useHover<HTMLDivElement>(false, { stopPropagation: true });

	const tooltip: ReactElement = useMemo(
		() => (
			<List>
				{options.map((option) => (
					<ListItem key={option.text} selected={false} onClick={option.onClick}>
						<ListItemText primary={option.text} />
					</ListItem>
				))}
			</List>
		),
		[options]
	);

	const onClick = useCallback(
		(event: MouseEvent<HTMLDivElement>) => {
			setActive(true);
		},
		[setActive]
	);

	const onClickOut = useCallback(() => setActive(false), [setActive]);

	return (
		<Tooltip
			popperClassName={classes.menu}
			active={active}
			direction="bottom-start"
			onClickOut={onClickOut}
			tooltip={tooltip}
		>
			<div ref={hoverRef} className={classnames(classes.root, className)} onClick={onClick}>
				<FaEllipsisV />
				<Overlay
					active={active || isHovered}
					opacity={active ? theme.surfaceOverlayFocused : theme.surfaceOverlayHovered}
				/>
			</div>
		</Tooltip>
	);
};
