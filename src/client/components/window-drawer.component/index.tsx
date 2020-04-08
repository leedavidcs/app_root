import { Classes, Drawer, IconName, Position } from "@blueprintjs/core";

import classnames from "classnames";
import React, { CSSProperties, FC, ReactElement, ReactNode, SyntheticEvent } from "react";
import { useStyles } from "./styles";

interface IProps {
	children?: ReactElement | null;
	className?: string;
	icon?: IconName;
	isOpen?: boolean;
	onClose?: (event?: SyntheticEvent) => void;
	position?: Position;
	size?: number | string;
	style?: CSSProperties;
	title?: ReactNode;
}

export const WindowDrawer: FC<IProps> = ({
	children,
	className,
	icon,
	isOpen = true,
	onClose,
	position,
	size = Drawer.SIZE_SMALL,
	style,
	title
}) => {
	const classes = useStyles();

	const drawerClassName: string = classnames(classes.root, Classes.DARK, className);

	return (
		<Drawer
			className={drawerClassName}
			backdropClassName={classes.backdrop}
			canEscapeKeyClose={true}
			canOutsideClickClose={true}
			icon={icon}
			isCloseButtonShown={true}
			isOpen={isOpen}
			onClose={onClose}
			portalClassName={drawerClassName}
			position={position}
			size={size}
			style={style}
			title={title}
			usePortal={true}
		>
			{children}
		</Drawer>
	);
};
