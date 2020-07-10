import React, { CSSProperties, FC, ReactElement } from "react";
import { useStyles } from "./styles";

export interface ISlideProps {
	children: ReactElement;
	style?: CSSProperties;
}

export const Slide: FC<ISlideProps> = ({ children, style }) => {
	const classes = useStyles();

	return (
		<div className={classes.root} style={style}>
			{children}
		</div>
	);
};
