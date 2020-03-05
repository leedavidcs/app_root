import classnames from "classnames";
import React, { FC } from "react";
import { useStyles } from "./styles";

export type DividerVariant = "full" | "inset" | "middle";

interface IProps {
	/** Classname to pass to the `hr` or `li` element of this component */
	className?: string;
	/** If true, the divider will be a `li`, otherwise will be a `hr`. This is for w3 validity */
	list?: boolean;
	/** Stylistic variation of the DividerElement (see stories) */
	variant?: DividerVariant;
}

export const Divider: FC<IProps> = ({ className, list, variant = "full" }) => {
	const classes = useStyles({ variant });

	const DividerElement = list ? "li" : "hr";

	return <DividerElement className={classnames(classes.root, className)} />;
};
