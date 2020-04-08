import { Popover } from "@/client/components";
import { useAuth } from "@/client/hooks";
import { Icon, Menu } from "@blueprintjs/core";
import Link from "next/link";
import React, { FC, useCallback, useState } from "react";
import { useStyles } from "./styles";

interface IProps {
	onClickSignOut?: () => void;
}

const useOnClickSignOut = (onCompleted?: () => void) => {
	const { logout } = useAuth();

	return useCallback(() => {
		logout();
		onCompleted?.();
	}, [logout, onCompleted]);
};

export const ProfileMenu: FC<IProps> = () => {
	const classes = useStyles();

	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onClose = useCallback(() => setIsOpen(false), []);
	const onOpen = useCallback(() => setIsOpen(true), []);

	const onClickSignOut = useOnClickSignOut(onClose);

	return (
		<Popover
			className={classes.root}
			content={
				<Menu>
					<Menu.Item icon="user" text="Your profile" />
					<Link href="/pricing" passHref={true}>
						<Menu.Item icon="cube" text="Credits" />
					</Link>
					<Menu.Item icon="log-out" onClick={onClickSignOut} text="Sign out" />
				</Menu>
			}
			isOpen={isOpen}
			position="bottom-right"
			onClose={onClose}
			usePortal={false}
		>
			<Icon className={classes.icon} icon="user" iconSize={24} onClick={onOpen} />
		</Popover>
	);
};
