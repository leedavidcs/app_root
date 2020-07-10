import { MenuContext } from "@/client/components/menu.component/context";
import type { IconName } from "@blueprintjs/core";
import { MenuItem as BpMenuItem } from "@blueprintjs/core";
import classnames from "classnames";
import Link from "next/link";
import React, {
	CSSProperties,
	FC,
	Fragment,
	memo,
	MouseEventHandler,
	ReactNode,
	ReactText,
	useContext
} from "react";
import { useStyles } from "./styles";

export interface IMenuItemProps {
	active?: boolean;
	className?: string;
	disabled?: boolean;
	href?: string;
	icon?: IconName;
	id?: ReactText;
	onClick?: MouseEventHandler<HTMLElement>;
	style?: CSSProperties;
	text?: ReactNode;
}

export const MenuItem: FC<IMenuItemProps> = memo(
	({ active, className, disabled, href, icon, id = href ?? "", onClick, style, text }) => {
		const classes = useStyles();

		const { activeItem } = useContext(MenuContext);

		const isActive: boolean = active ?? id === activeItem;

		return React.createElement<any>(
			href ? Link : Fragment,
			href ? { href, passHref: true } : {},
			<BpMenuItem
				className={classnames({ [classes.href]: Boolean(href) }, className)}
				active={isActive}
				disabled={disabled}
				icon={icon}
				onClick={onClick}
				style={style}
				text={text}
			/>
		);
	}
);

MenuItem.displayName = "MenuItem";
