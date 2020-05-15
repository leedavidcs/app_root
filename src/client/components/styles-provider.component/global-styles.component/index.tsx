import classnames from "classnames";
import { cloneElement, CSSProperties, FC, ReactElement, useEffect } from "react";
import { useStyles } from "./styles";

interface IProps {
	children: ReactElement;
	style?: CSSProperties;
}

export const GlobalStyles: FC<IProps> = ({ children, style }) => {
	const classes = useStyles();

	useEffect(() => {
		/* Add .bp3-dark to body, because portals may render outside of style root */
		document.body.classList.add("bp3-dark");

		return () => {
			document.body.classList.remove("bp3-dark");
		};
	}, []);

	return cloneElement(children, {
		className: classnames(classes.root, children.props.className),
		children: children.props.children,
		style
	});
};
