import { List, ListItem, ListItemIcon, ListItemText } from "@/client/components/list.component";
import React, { FC } from "react";
import { FaBacon } from "react-icons/fa";

interface IProps {
	onClickSignOut?: () => void;
}

export const ProfileMenu: FC<IProps> = ({ onClickSignOut = () => undefined }) => {
	return (
		<List>
			<ListItem selected={false}>
				<ListItemIcon>
					<FaBacon />
				</ListItemIcon>
				<ListItemText primary="Your profile" />
			</ListItem>
			<ListItem selected={false} onClick={onClickSignOut}>
				<ListItemIcon>
					<FaBacon />
				</ListItemIcon>
				<ListItemText primary={"Sign out"} />
			</ListItem>
		</List>
	);
};
