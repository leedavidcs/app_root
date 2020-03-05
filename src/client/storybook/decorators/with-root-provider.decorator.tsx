import { RootProvider } from "@/client/components";
import { DecoratorFunction } from "@storybook/addons";
import React, { ReactElement } from "react";

export const withRootProvider: DecoratorFunction<ReactElement> = (getStory) => {
	return <RootProvider mockRequests={true}>{getStory()}</RootProvider>;
};
