import { useTheme } from "@/client/hooks";
import classnames from "classnames";
import React, { cloneElement, FC, ReactElement } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import { useStyles } from "./styles";

interface IProps {
	children: ReactElement;
}

export const GlobalStyles: FC<IProps> = ({ children }) => {
	const classes = useStyles();
	const { theme } = useTheme();

	return cloneElement(children, {
		className: classnames(classes.root, children.props.className),
		children: (
			<SkeletonTheme
				color={theme.surfaceLoading}
				highlightColor={theme.surfaceLoadingHighlight}
			>
				{children.props.children}
			</SkeletonTheme>
		)
	});
};
