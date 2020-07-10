import { action } from "@storybook/addon-actions";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import Router from "next/router";
import React, { FC, ReactElement, useMemo, useState } from "react";

interface IProps {
	children: ReactElement;
}

export const MockNextRouter: FC<IProps> = ({ children }) => {
	const [pathname, setPathname] = useState<string>("/");

	const mockRouter = useMemo(
		() => ({
			pathname,
			prefetch: () => Promise.resolve(),
			push: (newPathname: string) => {
				action("next/router.push")(newPathname);
				setPathname(newPathname);

				return Promise.resolve();
			},
			replace: (newPathname: string) => {
				action("next/router.replace")(newPathname);
				setPathname(newPathname);

				return Promise.resolve();
			},
			route: `/${pathname}`
		}),
		[pathname, setPathname]
	);

	Router.router = mockRouter as any;

	return <RouterContext.Provider value={mockRouter as any}>{children}</RouterContext.Provider>;
};
