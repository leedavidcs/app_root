import { Tabs } from "@/client/components/tabs.component";
import React, { FC, ReactText, useCallback, useState } from "react";

export const StandardStory: FC = () => {
	const [selectedTab, setSelectedTab] = useState<ReactText>();

	const onChange = useCallback((newTab: ReactText) => setSelectedTab(newTab), []);

	return (
		<Tabs onChange={onChange} selectedTab={selectedTab}>
			<Tabs.Tab icon="badge" id={1} text="Banana" />
			<Tabs.Tab icon="badge" id={2} text="Apple" />
			<Tabs.Tab id={3} text="Melon" />
		</Tabs>
	);
};
