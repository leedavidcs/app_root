import { useHover } from "@/client/hooks";
import classnames from "classnames";
import React, { FC, MouseEvent, useRef } from "react";
import { useStyles } from "./styles";

interface IProps {
	/** Optional classes to pass to the `a` or `button` */
	className?: string;
	/**
	 * Uri to pass to the `a`. If this is passed-in, this component will be a wrapper around `a`.
	 * Otherwise, a `button` will be used instead.
	 */
	href?: string;
	/** HTMLAnchorElement or HTMLButtonElement onClick event */
	onClick?: (event: MouseEvent<HTMLElement>) => void;
	/** The text to use for this anchor */
	value: string;
}

export const Anchor: FC<IProps> = ({ className, href, onClick, value }) => {
	const classes = useStyles();

	const ref = useRef(null);
	const [isHovered] = useHover(false, {}, ref);

	const Wrapper = typeof href === "string" ? "a" : "button";

	return (
		<Wrapper
			ref={ref}
			href={href}
			className={classnames(classes.root, className, { [classes.focused]: isHovered })}
			onClick={onClick}
		>
			{value}
		</Wrapper>
	);
};
