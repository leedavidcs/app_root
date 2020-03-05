import { IKebabMenuOption, KebabMenu } from "@/client/components/kebab-menu.component";
import { action } from "@storybook/addon-actions";
import Faker from "faker";
import { range } from "lodash";
import React, { FC, useMemo } from "react";

Faker.seed(1);

const DATA_SIZE = 5;

export const StandardStory: FC = () => {
	const options: readonly IKebabMenuOption[] = useMemo(() => {
		return range(DATA_SIZE).map((__, i) => ({
			text: Faker.lorem.word(),
			onClick: action(`onClick${i}`)
		}));
	}, []);

	return <KebabMenu options={options} />;
};
