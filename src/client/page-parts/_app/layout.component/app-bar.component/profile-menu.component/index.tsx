import { List, ListItem, ListItemIcon, ListItemText } from "@/client/components/list.component";
import { Icon } from "@blueprintjs/core/lib/esm";
import React, { FC } from "react";

interface IProps {
	onClickSignOut?: () => void;
}

export const ProfileMenu: FC<IProps> = ({ onClickSignOut = () => undefined }) => {
	return (
		<List>
			<ListItem selected={false}>
				<ListItemIcon>
					<Icon icon="badge" />
				</ListItemIcon>
				<ListItemText primary="Your profile" />
			</ListItem>
			<ListItem selected={false} onClick={onClickSignOut}>
				<ListItemIcon>
					<Icon icon="badge" />
				</ListItemIcon>
				<ListItemText primary={"Sign out"} />
			</ListItem>
		</List>
	);
};
