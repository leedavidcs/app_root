import { Overlay } from "@/client/components/overlay.component";
import { Ripple } from "@/client/components/ripple.component";
import { useHover } from "@/client/hooks";
import composeRefs from "@seznam/compose-react-refs";
import classnames from "classnames";
import React, { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { useStyles } from "./styles";

const OVERLAY_OPACITY = 0.04;

export type ButtonColor =
	| "primary"
	| "primaryVariant"
	| "secondary"
	| "secondaryVariant"
	| "error"
	| "warning"
	| "transparent";
export type ButtonSize = "size" | "medium" | "large";

interface IProps {
	children?: ReactNode;
	/** Optional classes in pass to the outermost `button` */
	className?: string;
	/** The color scheme of the button. See story */
	color?: ButtonColor;
	/** HTMLButtonElement onClick event */
	onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
	/** The size variant of the button. See story */
	size?: ButtonSize;
	/** Native button["type"] property */
	type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
}

export const Button = forwardRef<HTMLButtonElement, IProps>(
	({ children, className, color = "primary", onClick, size = "medium", type }, ref) => {
		const classes = useStyles({ color });

		const [isHovered, hoverRef] = useHover<HTMLButtonElement>(false);

		return (
			<button
				ref={composeRefs(ref, hoverRef)}
				className={classnames(classes.root, className, classes[size])}
				type={type}
				onClick={onClick}
			>
				{children}
				<Overlay active={isHovered} opacity={OVERLAY_OPACITY} />
				<Ripple />
			</button>
		);
	}
);
