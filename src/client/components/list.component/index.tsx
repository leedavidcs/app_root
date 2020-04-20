import { DividerVariant } from "@/client/components/divider.component";
import classnames from "classnames";
import React, { FC, memo, ReactNode, ReactText, useMemo } from "react";
import { IListItemProps, ListItem } from "./list-item.component";
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
	/** Shorthand for selecting an item by id */
	selectedItem?: ReactText;
}

interface IWithStaticProps {
	Item: FC<IListItemProps>;
}

const _List: FC<IProps> = memo(({ children, className, divider = null, selectedItem }) => {
	const classes = useStyles();

	const value = useMemo(() => ({ divider, selectedItem }), [divider, selectedItem]);

	return (
		<ListContext.Provider value={value}>
			<ul className={classnames(classes.root, className)}>{children}</ul>
		</ListContext.Provider>
	);
});

_List.displayName = "List";

(_List as FC<IProps> & IWithStaticProps).Item = ListItem;

export const List = _List as FC<IProps> & IWithStaticProps;
