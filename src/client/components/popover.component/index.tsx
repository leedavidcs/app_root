import {
	Popover as BpPopover,
	PopoverPosition,
	PopperBoundary,
	PopperModifiers
} from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, memo, ReactElement, SyntheticEvent } from "react";
import { useStyles } from "./styles";

interface IProps {
	arrow?: boolean;
	boundary?: PopperBoundary;
	children: Maybe<ReactElement> | string;
	className?: string;
	content: Maybe<ReactElement> | string;
	disabled?: boolean;
	flip?: boolean;
	isOpen?: boolean;
	minimal?: boolean;
	onClose?: (event?: SyntheticEvent<HTMLElement>) => void;
	popoverClassName?: string;
	position?: PopoverPosition;
	preventOverflow?: boolean;
	usePortal?: boolean;
}

export const Popover: FC<IProps> = memo(
	({
		arrow = false,
		boundary = "viewport",
		children,
		className,
		content,
		disabled,
		flip = true,
		isOpen,
		minimal,
		onClose,
		popoverClassName,
		position,
		preventOverflow = true,
		usePortal
	}) => {
		const classes = useStyles();

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
			<BpPopover
				canEscapeKeyClose={true}
				className={className}
				content={content || undefined}
				disabled={disabled}
				isOpen={isOpen}
				minimal={minimal}
				modifiers={modifiers}
				onClose={onClose}
				popoverClassName={classnames(classes.popover, popoverClassName)}
				position={position}
				usePortal={usePortal}
			>
				{children}
			</BpPopover>
		);
	}
);

Popover.displayName = "Popover";
