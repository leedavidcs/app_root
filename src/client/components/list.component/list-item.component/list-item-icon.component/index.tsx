import React, { FC, ReactElement } from "react";
import { useStyles } from "./styles";

interface IProps {
	/** Element to use as the icon for this component. Built for react-icons */
	children: ReactElement;
}

export const ListItemIcon: FC<IProps> = ({ children }) => {
	const classes = useStyles();

	return <div className={classes.root}>{children}</div>;
};
