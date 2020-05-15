import { AnchorButton } from "@/client/components/anchor-button.component";
import { Button } from "@/client/components/button.component";
import { TabsContext } from "@/client/components/tabs.component/context";
import type { IconName } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, MouseEvent, ReactNode, ReactText, useCallback, useContext } from "react";
import { useStyles } from "./styles";

export interface ITabProps {
	active?: boolean;
	className?: string;
	disabled?: boolean;
	href?: string;
	icon?: IconName;
	id?: ReactText;
	onClick?: (event: MouseEvent<HTMLElement>) => void;
	text: ReactNode;
}

export const Tab: FC<ITabProps> = ({
	active,
	className,
	disabled,
	href,
	icon,
	id = href ?? "",
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

	const isSelected: boolean = active ?? selectedTab === id;

	return (
		<TabType
			className={classnames(classes.root, { [classes.selected]: isSelected }, className)}
			active={isSelected}
			disabled={disabled}
			href={href ?? ""}
			icon={icon}
			minimal={true}
			onClick={onClick}
			text={text}
		/>
	);
};
