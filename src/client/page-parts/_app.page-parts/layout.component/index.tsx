import { useSetUser } from "@/client/hooks";
import React, { FC, ReactElement, useEffect } from "react";
import { AppBar } from "./app-bar.component";

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
