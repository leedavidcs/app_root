import React, { FC, MouseEvent, ReactNodeArray, ReactText, useMemo } from "react";
import { TabsContext } from "./context";
import { ITabProps, Tab } from "./tab.component";

interface IProps {
	children: ReactNodeArray;
	className?: string;
	onChange?: (
		newTabId: ReactText,
		prevTabId: Maybe<ReactText>,
		event: MouseEvent<HTMLElement>
	) => void;
	selectedTab?: ReactText;
}

interface IWithStaticProps {
	Tab: FC<ITabProps>;
}

const _Tabs: FC<IProps> = ({ children, className, onChange, selectedTab }) => {
	const value = useMemo(() => ({ onChange, selectedTab }), [onChange, selectedTab]);

	return (
		<TabsContext.Provider value={value}>
			<nav className={className}>{children}</nav>
		</TabsContext.Provider>
	);
};

_Tabs.displayName = "Tabs";

(_Tabs as FC<IProps> & IWithStaticProps).Tab = Tab;

export const Tabs = _Tabs as FC<IProps> & IWithStaticProps;
