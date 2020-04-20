import { ResourcePathContext } from "@/client/components/resource-path.component/context";
import { useIsLastChild } from "@/client/hooks";
import classnames from "classnames";
import Link from "next/link";
import React, { FC, Fragment, ReactText, useContext, useRef } from "react";
import { useStyles } from "./styles";

export interface IResourcePathPart {
	className?: string;
	href?: string;
	id?: ReactText;
	text: string;
}

export const ResourcePathPart: FC<IResourcePathPart> = ({
	className,
	href,
	id = href ?? "",
	text
}) => {
	const classes = useStyles();

	const { activePath } = useContext(ResourcePathContext);

	const ref = useRef<HTMLElement>(null);

	const [isLastChild] = useIsLastChild(ref);

	const PartType = href ? "a" : "span";

	const active: boolean = activePath === id;

	return (
		<span ref={ref} className={className}>
			{React.createElement<any>(
				href ? Link : Fragment,
				href ? { href } : {},
				<PartType className={classnames({ [classes.active]: active })}>{text}</PartType>
			)}
			{!isLastChild && <span className={classes.divider}>/</span>}
		</span>
	);
};
