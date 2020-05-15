import type { IconName } from "@blueprintjs/core";
import { NonIdealState as BpNonIdeal } from "@blueprintjs/core";
import React, { FC, ReactChild, ReactElement, ReactNode } from "react";

interface IProps {
	action?: ReactElement;
	children?: ReactNode;
	className?: string;
	description?: ReactChild;
	icon?: IconName | Maybe<ReactElement>;
	title?: ReactNode;
}

export const NonIdealState: FC<IProps> = ({
	action,
	children,
	className,
	description,
	icon,
	title
}) => {
	return (
		<BpNonIdeal
			action={action}
			className={className}
			description={description}
			icon={icon}
			title={title}
		>
			{children}
		</BpNonIdeal>
	);
};
