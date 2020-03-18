import { useSetUser } from "@/client/hooks";
import { Button } from "@blueprintjs/core";
import React, { FC, ReactElement, useCallback, useEffect, useState } from "react";
import { AppBar } from "./app-bar.component";
import { AppDrawer } from "./app-drawer.component";

const APP_TITLE = "TheBrand Inc.";

interface IProps {
	children: ReactElement;
}

export const Layout: FC<IProps> = ({ children }) => {
	const [setUser, { called, loading }] = useSetUser();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onClickMenu = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen]);
	const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);

	useEffect(() => setUser(), [setUser]);

	const isLoaded: boolean = called && !loading;

	if (!isLoaded) {
		return null;
	}

	return (
		<main>
			<AppBar icon={<Button icon="menu" onClick={onClickMenu} />} title={APP_TITLE} />
			<AppDrawer isOpen={isOpen} onClose={onClose} title={APP_TITLE} />
			{children}
		</main>
	);
};

export default Layout;
