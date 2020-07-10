import { Context, createContext } from "react";

interface IScrollContextProps {
	onHorizontalScroll: (scrollOffset: number) => void;
	onVerticalScroll: (scrollOffset: number) => void;
	xOffset: number;
	yOffset: number;
}

export const ScrollContext: Context<IScrollContextProps> = createContext<IScrollContextProps>({
	onHorizontalScroll: () => undefined,
	onVerticalScroll: () => undefined,
	xOffset: 0,
	yOffset: 0
});

ScrollContext.displayName = "ScrollContext";
