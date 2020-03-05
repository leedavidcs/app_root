import { DividerVariant } from "@/client/components/divider.component";
import classnames from "classnames";
import React, { FC, ReactNode, useMemo } from "react";
import { ListContext } from "./list.context";
import { useStyles } from "./styles";

export * from "./list.context";
export * from "./list-item.component";

interface IProps {
	/** Elements to render within this components `ul` element */
	children: ReactNode;
	/** Optional classes to pass to the outer div of this component */
	className?: string;
	/** If provided, this component will automatically set dividers between list items */
	divider?: DividerVariant | null;
}

export const List: FC<IProps> = ({ children, divider = null, className }) => {
	const classes = useStyles();

	const value = useMemo(() => ({ divider }), [divider]);

	return (
		<ListContext.Provider value={value}>
			<ul className={classnames(classes.root, className)}>{children}</ul>
		</ListContext.Provider>
	);
};
