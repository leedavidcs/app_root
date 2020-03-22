import { ClickOutsideProvider, ModalProvider, StylesProvider } from "@/client/components";
import { MockApollo } from "@/client/graphql";
import { DecoratorFunction } from "@storybook/addons";
import React, { ReactElement } from "react";
import { MockNextRouter } from "./mock-next-router.component";

export const withRootProvider: DecoratorFunction<ReactElement> = (getStory) => {
	return (
		<MockNextRouter>
			<MockApollo>
				<StylesProvider>
					<ClickOutsideProvider>
						<ModalProvider>{getStory()}</ModalProvider>
					</ClickOutsideProvider>
				</StylesProvider>
			</MockApollo>
		</MockNextRouter>
	);
};
