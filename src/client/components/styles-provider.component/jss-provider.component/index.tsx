import { CustomTheme, standardTheme } from "@/client/themes";
import React, { FC, useMemo, useState } from "react";
import { ThemeProvider } from "react-jss";
import { ThemeSetterContext } from "./theme-setter.context";

export * from "./theme-setter.context";

export const JssProvider: FC = ({ children }) => {
	const [theme, setTheme] = useState<CustomTheme>(standardTheme);

	const value = useMemo(() => ({ setTheme, theme }), [setTheme, theme]);

	return (
		<ThemeSetterContext.Provider value={value}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</ThemeSetterContext.Provider>
	);
};
