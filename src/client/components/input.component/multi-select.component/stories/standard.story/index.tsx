import { MultiSelect } from "@/client/components/input.component/multi-select.component";
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
	const [selectedItems, setSelectedItems] = useState<readonly IMockItem[]>([]);

	const onItemRemove = useCallback(
		(newItems: readonly IMockItem[]) => setSelectedItems(newItems),
		[]
	);
	const onItemsClear = useCallback(() => setSelectedItems([]), []);

	const onItemSelect = useCallback(
		(item: IMockItem, e) => {
			setSelectedItems([...selectedItems, item]);
			action("onItemSelect")(item, e);
		},
		[selectedItems]
	);

	return (
		<MultiSelect
			items={MOCK_ITEMS}
			onItemRemove={onItemRemove}
			onItemsClear={onItemsClear}
			onItemSelect={onItemSelect}
			selectedItems={selectedItems}
		/>
	);
};
