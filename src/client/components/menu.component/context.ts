import { Context, createContext, ReactText } from "react";

interface IMenuContext {
	activeItem?: ReactText;
}

export const MenuContext: Context<IMenuContext> = createContext<IMenuContext>({});

MenuContext.displayName = "MenuContext";
