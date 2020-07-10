import type { IconName, Intent } from "@blueprintjs/core";
import { Alert as BpAlert } from "@blueprintjs/core";
import classnames from "classnames";
import React, { CSSProperties, FC, ReactElement, SyntheticEvent } from "react";
import { useStyles } from "./styles";

interface IProps {
	cancelButtonText?: string;
	children: ReactElement;
	className?: string;
	confirmButtonText?: string;
	icon?: IconName;
	intent?: Intent;
	isOpen: boolean;
	onCancel?: (event?: SyntheticEvent<HTMLElement>) => void;
	onClose?: (confirmed: boolean, event?: SyntheticEvent<HTMLElement>) => void;
	onConfirm?: (event?: SyntheticEvent<HTMLElement>) => void;
	style?: CSSProperties;
}

export const Alert: FC<IProps> = ({
	cancelButtonText,
	children,
	className,
	confirmButtonText,
	icon,
	intent,
	isOpen,
	onCancel,
	onClose,
	onConfirm,
	style
}) => {
	const classes = useStyles();

	return (
		<BpAlert
			cancelButtonText={cancelButtonText}
			className={classnames(classes.root, className)}
			confirmButtonText={confirmButtonText}
			icon={icon}
			intent={intent}
			isOpen={isOpen}
			onCancel={onCancel}
			onClose={onClose}
			onConfirm={onConfirm}
			style={style}
		>
			{children}
		</BpAlert>
	);
};
