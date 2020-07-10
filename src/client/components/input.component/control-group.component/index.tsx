import { ControlGroup as BpControlGroup } from "@blueprintjs/core";
import React, { CSSProperties, FC, ReactNode } from "react";

interface IProps {
	children?: ReactNode;
	className?: string;
	fill?: boolean;
	style?: CSSProperties;
	vertical?: boolean;
}

export const ControlGroup: FC<IProps> = ({ children, className, fill, style, vertical }) => {
	return (
		<BpControlGroup className={className} fill={fill} style={style} vertical={vertical}>
			{children}
		</BpControlGroup>
	);
};
