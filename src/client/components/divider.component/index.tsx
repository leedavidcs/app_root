import classnames from "classnames";
import React, { FC } from "react";
import { useStyles } from "./styles";

export type DividerVariant = "full" | "inset" | "middle" | "spaced";

interface IProps {
	/** Classname to pass to the `hr` or `li` element of this component */
	className?: string;
	/** Element tag name to render this element */
	tagName?: keyof JSX.IntrinsicElements;
	/** Stylistic variation of the DividerElement (see stories) */
	variant?: DividerVariant;
}

export const Divider: FC<IProps> = ({ className, tagName = "hr", variant = "full" }) => {
	const classes = useStyles({ variant });

	const DividerElement = tagName;

	return (
		<DividerElement
			className={classnames(
				classes.root,
				{
					[classes.inset]: variant === "inset",
					[classes.middle]: variant === "middle",
					[classes.spaced]: variant === "spaced"
				},
				className
			)}
		/>
	);
};
