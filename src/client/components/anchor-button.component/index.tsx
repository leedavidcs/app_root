import type { Alignment, IconName, Intent } from "@blueprintjs/core";
import { AnchorButton as BpButton } from "@blueprintjs/core";
import classnames from "classnames";
import Link from "next/link";
import React, { CSSProperties, FC, MouseEvent, ReactElement, ReactNode } from "react";
import { useStyles } from "./styles";

interface IProps {
	active?: boolean;
	alignText?: Alignment;
	className?: string;
	disabled?: boolean;
	href: string;
	icon?: IconName | Maybe<ReactElement>;
	intent?: Intent;
	loading?: boolean;
	minimal?: boolean;
	onClick?: (event: MouseEvent<HTMLElement>) => void;
	outlined?: boolean;
	rightIcon?: IconName | Maybe<ReactElement>;
	style?: CSSProperties;
	text?: ReactNode;
	type?: "submit" | "reset" | "button";
}

export const AnchorButton: FC<IProps> = ({
	active,
	alignText,
	children,
	className,
	disabled,
	href,
	icon,
	intent,
	loading,
	minimal,
	onClick,
	outlined,
	rightIcon,
	style,
	text,
	type
}) => {
	const classes = useStyles();

	return (
		<Link href={href} passHref={true}>
			<BpButton
				className={classnames(classes.root, className)}
				active={active}
				alignText={alignText}
				disabled={disabled}
				icon={icon}
				intent={intent}
				loading={loading}
				minimal={minimal}
				onClick={onClick}
				outlined={outlined}
				rightIcon={rightIcon}
				style={style}
				text={text}
				type={type}
			>
				{children}
			</BpButton>
		</Link>
	);
};
