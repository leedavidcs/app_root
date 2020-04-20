import { useIsLastChild } from "@/client/hooks";
import classnames from "classnames";
import Link from "next/link";
import React, { FC, Fragment, useRef } from "react";
import { useStyles } from "./styles";

export interface IResourcePathPart {
	active?: boolean;
	className?: string;
	href?: string;
	text: string;
}

export const ResourcePathPart: FC<IResourcePathPart> = ({ active, className, href, text }) => {
	const classes = useStyles();

	const ref = useRef<HTMLElement>(null);

	const [isLastChild] = useIsLastChild(ref);

	const PartType = href ? "a" : "span";

	return (
		<span ref={ref} className={classnames(classes.root, className)}>
			{React.createElement<any>(
				href ? Link : Fragment,
				href ? { href } : {},
				<PartType className={classnames({ [classes.active]: active })}>{text}</PartType>
			)}
			{!isLastChild && <span className={classes.divider}>/</span>}
		</span>
	);
};
