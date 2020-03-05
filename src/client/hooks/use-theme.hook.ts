import {
	IThemeContextProps,
	ThemeSetterContext
} from "@/client/components/root-provider.component";
import { useContext } from "react";

export const useTheme = () => useContext<IThemeContextProps>(ThemeSetterContext);
