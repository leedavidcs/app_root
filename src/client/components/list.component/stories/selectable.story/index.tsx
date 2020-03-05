import { List, ListItem, ListItemIcon, ListItemText } from "@/client/components/list.component";
import React, { FC, useCallback, useState } from "react";
import { FaApple, FaBacon } from "react-icons/fa";

export const SelectableStory: FC = () => {
	const [selectedIndex, setSelectedIndex] = useState<number>(0);

	const onClick = useCallback((index: number) => () => setSelectedIndex(index), [
		setSelectedIndex
	]);

	return (
		<List divider="full">
			<ListItem selected={selectedIndex === 0} onClick={onClick(0)}>
				<ListItemIcon>
					<FaBacon />
				</ListItemIcon>
				<ListItemText primary="Banana" />
			</ListItem>
			<ListItem selected={selectedIndex === 1} onClick={onClick(1)}>
				<ListItemIcon>
					<FaApple />
				</ListItemIcon>
				<ListItemText primary="Apple" />
			</ListItem>
			<ListItem selected={selectedIndex === 2} onClick={onClick(2)}>
				<ListItemText primary="Strawberry" />
			</ListItem>
		</List>
	);
};
