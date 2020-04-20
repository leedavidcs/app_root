import { Classes } from "@blueprintjs/core";
import classnames from "classnames";
import { cloneElement, CSSProperties, FC, ReactElement } from "react";
import { useStyles } from "./styles";

interface IProps {
	children: ReactElement;
	style?: CSSProperties;
}

export const GlobalStyles: FC<IProps> = ({ children, style }) => {
	const classes = useStyles();

	return cloneElement(children, {
		className: classnames(Classes.DARK, classes.root, children.props.className),
		children: children.props.children,
		style
	});
};
