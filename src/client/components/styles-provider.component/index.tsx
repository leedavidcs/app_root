import React, { CSSProperties, FC, ReactElement } from "react";
import { GlobalStyles } from "./global-styles.component";
import { JssProvider } from "./jss-provider.component";

export * from "./global-styles.component";
export * from "./jss-provider.component";

interface IProps {
	children: ReactElement;
	style?: CSSProperties;
}

export const StylesProvider: FC<IProps> = ({ children, style }) => {
	return (
		<JssProvider>
			<GlobalStyles style={style}>{children}</GlobalStyles>
		</JssProvider>
	);
};
