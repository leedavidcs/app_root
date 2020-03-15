import { CustomTheme, standardTheme } from "@/client/themes";
import { Context, createContext } from "react";

export interface IJssProviderState {
	theme: CustomTheme;
}

export interface IThemeContextProps {
	setTheme: (theme: CustomTheme) => void;
	theme: CustomTheme;
}

export const ThemeSetterContext: Context<IThemeContextProps> = createContext<IThemeContextProps>({
	setTheme: () => undefined,
	theme: standardTheme
});

ThemeSetterContext.displayName = "ThemeSetterContext";
