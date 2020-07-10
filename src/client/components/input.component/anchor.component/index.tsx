import { useHover } from "@/client/hooks";
import classnames from "classnames";
import Link from "next/link";
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
	/** If href, should next/link be used */
	useLink?: boolean;
	/** The text to use for this anchor */
	value: string;
}

export const Anchor: FC<IProps> = ({ className, href, onClick, useLink = true, value }) => {
	const classes = useStyles();

	const ref = useRef(null);
	const [isHovered] = useHover(false, {}, ref);

	const Wrapper = typeof href === "string" ? "a" : "button";

	const child = (
		<Wrapper
			ref={ref}
			className={classnames(classes.root, className, { [classes.focused]: isHovered })}
			onClick={onClick}
		>
			{value}
		</Wrapper>
	);

	return typeof href === "string" && useLink ? (
		<Link href={href} passHref={true}>
			{child}
		</Link>
	) : (
		child
	);
};
