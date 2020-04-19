import { Context, createContext, MouseEvent, ReactText } from "react";

interface ITabsContext {
	onChange?: (
		newTabId: ReactText,
		prevTabId: Maybe<ReactText>,
		event: MouseEvent<HTMLElement>
	) => void;
	selectedTab?: ReactText;
}

export const TabsContext: Context<ITabsContext> = createContext<ITabsContext>({});

TabsContext.displayName = "TabsContext";
