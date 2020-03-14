import { ClickOutsideProvider } from "@/client/components/click-outside.component";
import { ModalProvider } from "@/client/components/modal.component";
import React, { FC, ReactNode } from "react";
import { GlobalStyles } from "./global-styles.component";
import { JssProvider } from "./jss-provider.component";

export * from "./global-styles.component";
export * from "./jss-provider.component";

interface IProps {
	children: ReactNode;
}

export const RootProvider: FC<IProps> = ({ children }) => {
	return (
		<JssProvider>
			<GlobalStyles>
				<ClickOutsideProvider>
					<ModalProvider>{children}</ModalProvider>
				</ClickOutsideProvider>
			</GlobalStyles>
		</JssProvider>
	);
};
