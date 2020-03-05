import classnames from "classnames";
import React, { FC, ReactNode } from "react";
import { useStyles } from "./styles";

interface IProps {
	/** Optional classes to pass to the outer div of this component */
	className?: string;
	/** Top text to display on this component */
	primary: ReactNode;
	/** Bottom text to display on this component */
	secondary?: ReactNode;
}

export const ListItemText: FC<IProps> = ({ className, primary, secondary }) => {
	const classes = useStyles();

	return (
		<div
			className={classnames(classes.root, className, {
				[classes.multiline]: primary && secondary
			})}
		>
			{primary}
			{secondary && <div className={classes.secondary}>{secondary}</div>}
		</div>
	);
};
