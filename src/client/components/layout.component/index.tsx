import { AppBar } from "@/client/components/app-bar.component";
import { useSetUser } from "@/client/hooks";
import { useEffect } from "@storybook/addons";
import React, { FC, ReactElement } from "react";

interface IProps {
	children: ReactElement;
}

export const Layout: FC<IProps> = ({ children }) => {
	const [setUser] = useSetUser();

	useEffect(() => setUser(), [setUser]);

	return (
		<main>
			<AppBar title="TheBrand Inc." />
			{children}
		</main>
	);
};

export default Layout;
