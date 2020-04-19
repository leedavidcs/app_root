import { TabsContext } from "@/client/components/tabs.component/context";
import { AnchorButton, Button, IconName } from "@blueprintjs/core";
import classnames from "classnames";
import Link from "next/link";
import React, {
	FC,
	Fragment,
	MouseEvent,
	ReactNode,
	ReactText,
	useCallback,
	useContext
} from "react";
import { useStyles } from "./styles";

export interface ITabProps {
	className?: string;
	disabled?: boolean;
	href?: string;
	icon?: IconName;
	id: ReactText;
	onClick?: (event: MouseEvent<HTMLElement>) => void;
	text: ReactNode;
}

export const Tab: FC<ITabProps> = ({
	className,
	disabled,
	href,
	icon,
	id,
	onClick: _onClick,
	text
}) => {
	const classes = useStyles();

	const { onChange, selectedTab } = useContext(TabsContext);

	const onClick = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			_onClick?.(event);

			onChange?.(id, selectedTab, event);
		},
		[_onClick, id, onChange, selectedTab]
	);

	const TabType = href ? AnchorButton : Button;

	const isSelected: boolean = selectedTab === id;

	return React.createElement<any>(
		href ? Link : Fragment,
		{ ...(href ? { href, passHref: true } : {}) },
		<TabType
			className={classnames(classes.root, { [classes.selected]: isSelected }, className)}
			active={isSelected}
			disabled={disabled}
			icon={icon}
			minimal={true}
			onClick={onClick}
			text={text}
		/>
	);
};
