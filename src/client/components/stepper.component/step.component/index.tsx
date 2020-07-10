import { Icon } from "@/client/components/icon.component";
import type { Intent } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, MouseEvent, ReactElement, useCallback } from "react";
import { useStyles } from "./styles";

export interface IStepProps {
	active?: boolean;
	className?: string;
	completed?: boolean;
	error?: Maybe<string | ReactElement>;
	index?: number;
	label?: string;
	onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export const Step: FC<IStepProps> = ({
	active,
	className,
	completed,
	error,
	index = 0,
	label,
	onClick: _onClick
}) => {
	const classes = useStyles();

	const intent: Intent = error ? "danger" : completed || active ? "primary" : "none";

	const isFirst: boolean = index === 0;
	const isActive = Boolean(active || completed);

	const onClick = useCallback(
		(event: MouseEvent<HTMLDivElement>) => {
			if (active || completed) {
				_onClick?.(event);
			}
		},
		[_onClick, active, completed]
	);

	return (
		<div
			className={classnames(
				classes.root,
				{
					[classes.withConnector]: !isFirst,
					[classes.textInactive]: !isActive
				},
				className
			)}
			onClick={onClick}
		>
			{!isFirst && (
				<div
					className={classnames(classes.connector, {
						[classes.connectorActive]: active || completed
					})}
				/>
			)}
			<div className={classes.step}>
				<div className={classes.iconWrapper}>
					<Icon
						className={classes.icon}
						icon={error ? "warning-sign" : "full-circle"}
						intent={intent}
						iconSize={24}
					/>
					{completed ? (
						<Icon className={classes.iconLegend} icon="small-tick" />
					) : (
						<span className={classes.iconLegend}>{index + 1}</span>
					)}
				</div>
				{label && <p className={classes.label}>{label}</p>}
			</div>
		</div>
	);
};
