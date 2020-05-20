import { Button } from "@/client/components/button.component";
import { FormMultiSelect } from "@/client/components/input.component/form-multi-select.component";
import { getYupValidationResolver } from "@/client/utils";
import { action } from "@storybook/addon-actions";
import Faker from "faker";
import { range } from "lodash";
import React, { FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import { array, object, string } from "yup";

Faker.seed(1);

const DATA_SIZE = 20;
const MIN_LENGTH = 5;

interface IMockData {
	key: string;
	uuid: string;
}

interface IFormData {
	demo: readonly IMockData[];
}

const mockData: readonly IMockData[] = range(DATA_SIZE).map(() => {
	const uuid = Faker.random.uuid();

	return { uuid, key: uuid };
});

const TypedFormMultiSelect = FormMultiSelect.ofType<IMockData>();

const validationResolver = getYupValidationResolver<IFormData>(() => ({
	demo: array<IMockData>()
		.of(
			object({
				key: string().required(),
				uuid: string().required()
			}).required()
		)
		.required()
		.min(MIN_LENGTH, "Must select at least 5 items")
}));

export const StandardStory: FC = () => {
	const { control, errors, handleSubmit } = useForm<IFormData>({ validationResolver });

	const itemsEqual = useCallback((itemA: IMockData, itemB: IMockData) => {
		return itemA.key === itemB.key;
	}, []);

	return (
		<form onSubmit={handleSubmit(action("onSubmit"))}>
			<TypedFormMultiSelect
				control={control}
				error={(errors.demo as any)?.message}
				items={mockData}
				itemsEqual={itemsEqual}
				label="Demo"
				name="demo"
			/>
			<Button text="Submit" type="submit" />
		</form>
	);
};
