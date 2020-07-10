import { Button } from "@/client/components";
import { GetUserDocument, useSetUserMutation } from "@/client/graphql";
import { useInitialLoadActions } from "@/client/hooks";
import React, { FC, ReactElement, useCallback, useEffect, useState } from "react";
import { AppBar } from "./app-bar.component";
import { AppDrawer } from "./app-drawer.component";
import { AppFooter } from "./app-footer.component";
import { useStyles } from "./styles";

interface IProps {
	children: ReactElement;
}

export const Layout: FC<IProps> = ({ children }) => {
	const classes = useStyles();

	const [setUser, { called, loading }] = useSetUserMutation({
		awaitRefetchQueries: true,
		refetchQueries: [{ query: GetUserDocument }]
	});

	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onClickMenu = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen]);
	const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);

	useEffect(() => {
		setUser();
	}, [setUser]);

	useInitialLoadActions();

	const isLoaded: boolean = called && !loading;

	if (!isLoaded) {
		return null;
	}

	return (
		<div className={classes.root}>
			<div className={classes.content}>
				<AppBar icon={<Button icon="menu" minimal={true} onClick={onClickMenu} />} />
				<AppDrawer isOpen={isOpen} onClose={onClose} />
				{children}
			</div>
			<AppFooter className={classes.footer} />
		</div>
	);
};

export default Layout;
