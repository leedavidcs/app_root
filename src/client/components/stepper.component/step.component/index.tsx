import { Icon, Intent } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, ReactElement } from "react";
import { useStyles } from "./styles";

export interface IStepProps {
	active?: boolean;
	completed?: boolean;
	error?: Maybe<string | ReactElement>;
	index?: number;
	label?: string;
}

export const Step: FC<IStepProps> = ({ active, completed, error, index = 0, label }) => {
	const classes = useStyles();

	const intent: Intent = error ? "danger" : completed || active ? "primary" : "none";

	const isFirst: boolean = index === 0;
	const isActive = Boolean(active || completed);

	return (
		<div
			className={classnames(classes.root, {
				[classes.withConnector]: !isFirst,
				[classes.textInactive]: !isActive
			})}
		>
			{!isFirst && <div className={classes.connector} />}
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
