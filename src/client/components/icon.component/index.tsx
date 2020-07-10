import type { IconName, Intent } from "@blueprintjs/core";
import { Icon as BpIcon } from "@blueprintjs/core";
import React, { CSSProperties, FC, MouseEvent } from "react";

interface IProps {
	className?: string;
	color?: string;
	htmlTitle?: string;
	icon?: IconName;
	iconSize?: number;
	intent?: Intent;
	onClick?: (event: MouseEvent<HTMLElement>) => void;
	style?: CSSProperties;
	title?: string;
}

export const Icon: FC<IProps> = ({
	className,
	color,
	htmlTitle,
	icon,
	iconSize,
	intent,
	onClick,
	style,
	title
}) => {
	return (
		<BpIcon
			className={className}
			color={color}
			htmlTitle={htmlTitle}
			icon={icon}
			iconSize={iconSize}
			intent={intent}
			onClick={onClick}
			style={style}
			title={title}
		/>
	);
};
