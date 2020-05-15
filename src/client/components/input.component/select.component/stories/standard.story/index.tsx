import { Button } from "@/client/components/button.component";
import { Select } from "@/client/components/input.component/select.component";
import { action } from "@storybook/addon-actions";
import Faker from "faker";
import { range } from "lodash";
import React, { FC, useCallback, useState } from "react";

const ITEMS_SIZE = 50;

interface IMockItem {
	key: string;
}

const MOCK_ITEMS: readonly IMockItem[] = range(ITEMS_SIZE).map(() => ({
	key: `${Faker.name.firstName()} ${Faker.name.lastName()}`
}));

export const StandardStory: FC = () => {
	const [selected, setSelected] = useState<Maybe<IMockItem>>(null);

	const onItemSelect = useCallback((item) => {
		setSelected(item);
		action("onItemSelect")(item);
	}, []);

	return (
		<Select items={MOCK_ITEMS} minimal={true} onItemSelect={onItemSelect}>
			<Button text={selected ? selected.key : "Select an item"} />
		</Select>
	);
};
