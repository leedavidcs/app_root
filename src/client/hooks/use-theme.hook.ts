import {
	IThemeContextProps,
	ThemeSetterContext
} from "@/client/components/styles-provider.component";
import { useContext } from "react";

export const useTheme = () => useContext<IThemeContextProps>(ThemeSetterContext);
