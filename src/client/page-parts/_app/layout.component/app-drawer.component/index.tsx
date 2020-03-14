import { WindowDrawer } from "@/client/components";
import React, { FC, SyntheticEvent } from "react";
import { DrawerContent } from "./drawer-content.component";

const APP_DRAWER_SIZE = 240;

interface IProps {
	isOpen: boolean;
	onClose: (event?: SyntheticEvent) => void;
	title?: string;
}

export const AppDrawer: FC<IProps> = ({ isOpen, onClose, title }) => {
	return (
		<WindowDrawer
			isOpen={isOpen}
			onClose={onClose}
			position="left"
			size={APP_DRAWER_SIZE}
			title={title}
		>
			<DrawerContent />
		</WindowDrawer>
	);
};
