import { IMenuDividerProps, Menu as BpMenu } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, memo, ReactNodeArray, ReactText, useMemo } from "react";
import { MenuContext } from "./context";
import { MenuDivider } from "./menu-divider.component";
import { IMenuItemProps, MenuItem } from "./menu-item.component";
import { useStyles } from "./styles";

interface IProps {
	children?: ReactNodeArray;
	className?: string;
	activeItem?: ReactText;
}

interface IWithStaticProps {
	Divider: FC<IMenuDividerProps>;
	Item: FC<IMenuItemProps>;
}

const _Menu: FC<IProps> = memo(({ activeItem, children, className }) => {
	const classes = useStyles();

	const value = useMemo(() => ({ activeItem }), [activeItem]);

	return (
		<MenuContext.Provider value={value}>
			<BpMenu className={classnames(classes.root, className)}>{children}</BpMenu>
		</MenuContext.Provider>
	);
});

_Menu.displayName = "Menu";

(_Menu as FC<IProps> & IWithStaticProps).Item = MenuItem;
(_Menu as FC<IProps> & IWithStaticProps).Divider = MenuDivider;

export const Menu = _Menu as FC<IProps> & IWithStaticProps;
