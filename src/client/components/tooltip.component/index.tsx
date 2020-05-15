import { useTheme } from "@/client/hooks";
import type { PopoverPosition, PopperBoundary, PopperModifiers } from "@blueprintjs/core";
import { Tooltip as BpTooltip } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, ReactElement, SyntheticEvent } from "react";
import { useStyles } from "./styles";

interface IProps {
	arrow?: boolean;
	boundary?: PopperBoundary;
	children?: Maybe<ReactElement> | string;
	className?: string;
	content?: Maybe<ReactElement> | string;
	disabled?: boolean;
	flip?: boolean;
	isOpen?: boolean;
	onClose?: (event?: SyntheticEvent<HTMLElement>) => void;
	onInteraction?: (nextOpenState: boolean, event?: SyntheticEvent<HTMLElement>) => void;
	popoverClassName?: string;
	popoverColor?: string;
	position?: PopoverPosition;
	preventOverflow?: boolean;
}

export const Tooltip: FC<IProps> = (props) => {
	const { theme } = useTheme();

	const {
		arrow = true,
		boundary = "viewport",
		children,
		className,
		content,
		disabled,
		flip = true,
		isOpen,
		onClose,
		onInteraction,
		popoverClassName,
		popoverColor = theme.surface,
		position,
		preventOverflow = true
	} = props;

	const classes = useStyles({ popoverColor });

	const modifiers: PopperModifiers = {
		arrow: { enabled: arrow },
		flip: {
			enabled: flip,
			boundariesElement: boundary
		},
		preventOverflow: {
			enabled: preventOverflow,
			boundariesElement: boundary
		}
	};

	return (
		<BpTooltip
			className={className}
			content={content || undefined}
			disabled={disabled}
			isOpen={isOpen}
			modifiers={modifiers}
			onClose={onClose}
			onInteraction={onInteraction}
			popoverClassName={classnames(classes.popover, popoverClassName)}
			position={position}
		>
			{children}
		</BpTooltip>
	);
};
