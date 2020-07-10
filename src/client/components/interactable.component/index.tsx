import { Overlay } from "@/client/components/overlay.component";
import { Ripple } from "@/client/components/ripple.component";
import { useHover, useTheme } from "@/client/hooks";
import composeRefs from "@seznam/compose-react-refs";
import classnames from "classnames";
import React, { forwardRef, ReactHTML, ReactNode } from "react";
import { useStyles } from "./styles";

interface IProps {
	active?: boolean;
	as?: keyof ReactHTML;
	children: ReactNode;
	className?: string;
	onClick?: () => void;
}

export const Interactable = forwardRef<any, IProps>(
	({ active = false, as = "div", className, children, onClick, ...restProps }, ref) => {
		const classes = useStyles();
		const { theme } = useTheme();

		const [isHovered, hoverResult] = useHover<any>(false, { stopPropagation: true });

		/**
		 * !HACK
		 * @description Typescript emits an error, that this produces a union type that is too
		 *     complex to evaluate. Cast as any to skip this evaluation, and resolve the error.
		 * @author David Lee
		 * @date February 28, 2020
		 */
		const RootType: any = as;

		return (
			<RootType
				{...restProps}
				ref={composeRefs(hoverResult.ref, ref)}
				className={classnames(classes.root, className)}
				onClick={onClick}
			>
				{children}
				<Ripple />
				<Overlay
					active={active || isHovered}
					opacity={active ? theme.surfaceOverlayFocused : theme.surfaceOverlayHovered}
				/>
			</RootType>
		);
	}
);

Interactable.displayName = "Interactable";
