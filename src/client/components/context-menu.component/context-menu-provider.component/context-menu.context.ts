import { ITooltipLocation } from "@/client/hooks";
import { Context, createContext } from "react";

export interface IContextMenuRegisterHandlers {
	close: () => void;
	open: (location: ITooltipLocation) => void;
}

interface IContextMenuContextProps {
	close: (id?: string) => void;
	open: (id: string, location: ITooltipLocation) => void;
	register: (handlers: IContextMenuRegisterHandlers) => string;
	unregister: (id: string) => void;
}

export const ContextMenuContext: Context<IContextMenuContextProps> = createContext<
	IContextMenuContextProps
>({
	close: () => undefined,
	open: () => undefined,
	register: () => "",
	unregister: () => undefined
});

ContextMenuContext.displayName = "ContextMenuContext";
