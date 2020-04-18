import { List, ListItem } from "@/client/components/list.component";
import React, { FC, useCallback, useState } from "react";

export const SelectableStory: FC = () => {
	const [selected, setSelected] = useState<number>(0);

	const onClick = useCallback((index: number) => () => setSelected(index), []);

	return (
		<List divider="full">
			<ListItem selected={selected === 0} onClick={onClick(0)} icon="badge" text="Banana" />
			<ListItem selected={selected === 1} onClick={onClick(1)} icon="badge" text="Apple" />
			<ListItem selected={selected === 2} onClick={onClick(2)} text="Melon" />
		</List>
	);
};
