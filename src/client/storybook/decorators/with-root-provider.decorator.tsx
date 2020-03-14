import { RootProvider } from "@/client/components";
import { MockApollo } from "@/client/graphql";
import { DecoratorFunction } from "@storybook/addons";
import React, { ReactElement } from "react";

export const withRootProvider: DecoratorFunction<ReactElement> = (getStory) => {
	return (
		<MockApollo>
			<RootProvider>{getStory()}</RootProvider>
		</MockApollo>
	);
};
