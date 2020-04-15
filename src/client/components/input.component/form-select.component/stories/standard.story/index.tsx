import { FormSelect } from "@/client/components/input.component/form-select.component";
import { getYupValidationResolver } from "@/client/utils";
import { Button } from "@blueprintjs/core";
import { action } from "@storybook/addon-actions";
import Faker from "faker";
import { range } from "lodash";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

Faker.seed(1);

const DATA_SIZE = 20;

interface IMockData {
	key: string;
	uuid: string;
}

interface IFormData {
	demo: IMockData;
}

const mockData: readonly IMockData[] = range(DATA_SIZE).map(() => {
	const uuid = Faker.random.uuid();

	return { uuid, key: uuid };
});

const TypedFormSelect = FormSelect.ofType<IMockData>();

const validationResolver = getYupValidationResolver<IFormData>(() => ({
	demo: object()
		.shape({
			key: string().required(),
			uuid: string().required()
		})
		.test({
			message: "Value must start with alphabetic letter",
			test: (value: IMockData) => /^[a-z].*$/i.test(value.key)
		})
}));

export const StandardStory: FC = () => {
	const { control, errors, handleSubmit } = useForm<IFormData>({ validationResolver });

	return (
		<form onSubmit={handleSubmit(action("onSubmit"))}>
			<TypedFormSelect
				control={control}
				error={(errors.demo as any)?.message}
				items={mockData}
				label="Demo"
				name="demo"
			/>
			<Button text="Submit" type="submit" />
		</form>
	);
};
