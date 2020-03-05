import { Context, createContext, MouseEventHandler } from "react";

export interface IHandlerInfo {
	type: "click" | "mousedown" | "mouseup";
	handler: MouseEventHandler<HTMLDivElement>;
}

interface IClickOutsideContextProps {
	register: (handler: IHandlerInfo) => string;
	unregister: (id: string) => void;
}

export const ClickOutsideContext: Context<IClickOutsideContextProps> = createContext<
	IClickOutsideContextProps
>({
	register: () => "",
	unregister: () => undefined
});

ClickOutsideContext.displayName = "ClickOutsideContext";
