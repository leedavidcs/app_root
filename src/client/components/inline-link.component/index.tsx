import classnames from "classnames";
import Link from "next/link";
import React, { FC, ReactNode } from "react";
import { useStyles } from "./styles";

interface IProps {
	children?: ReactNode;
	className?: string;
	href: string;
	text?: string;
}

export const InlineLink: FC<IProps> = ({ children, className, href, text }) => {
	const classes = useStyles();

	return (
		<Link href={href}>
			<a className={classnames(classes.root, className)}>{text ?? children}</a>
		</Link>
	);
};
