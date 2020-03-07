import { ClickOutsideProvider } from "@/client/components/click-outside.component";
import { ModalProvider } from "@/client/components/modal.component";
import React, { FC, ReactNode } from "react";
import { ApolloProvider } from "./apollo-provider.component";
import { GlobalStyles } from "./global-styles.component";
import { JssProvider } from "./jss-provider.component";

export * from "./global-styles.component";
export * from "./jss-provider.component";

interface IProps {
	children: ReactNode;
	mockRequests?: boolean;
}

export const RootProvider: FC<IProps> = ({ children, mockRequests = true }) => {
	return (
		<ApolloProvider mockRequests={mockRequests}>
			<JssProvider>
				<GlobalStyles>
					<ClickOutsideProvider>
						<ModalProvider>{children}</ModalProvider>
					</ClickOutsideProvider>
				</GlobalStyles>
			</JssProvider>
		</ApolloProvider>
	);
};
