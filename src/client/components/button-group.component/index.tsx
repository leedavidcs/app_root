import type { Alignment } from "@blueprintjs/core";
import { ButtonGroup as BpGroup } from "@blueprintjs/core";
import React, { FC, ReactNode } from "react";

interface IProps {
	alignText?: Alignment;
	children?: ReactNode;
	className?: string;
	fill?: boolean;
	minimal?: boolean;
}

export const ButtonGroup: FC<IProps> = ({ alignText, children, className, fill, minimal }) => {
	return (
		<BpGroup className={className} alignText={alignText} fill={fill} minimal={minimal}>
			{children}
		</BpGroup>
	);
};
