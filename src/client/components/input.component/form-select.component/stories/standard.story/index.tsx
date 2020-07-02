import { Button } from "@/client/components/button.component";
import { FormSelect } from "@/client/components/input.component/form-select.component";
import { yupResolver } from "@hookform/resolvers";
import { action } from "@storybook/addon-actions";
import Faker from "faker";
import { range } from "lodash";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import yup from "yup";

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

const resolver = yupResolver<IFormData>(
	yup.object().shape({
		demo: yup
			.object()
			.shape({
				key: yup.string().required(),
				uuid: yup.string().required()
			})
			.test({
				message: "Value must start with alphabetic letter",
				test: (value: IMockData) => /^[a-z].*$/i.test(value.key)
			})
	})
);

export const StandardStory: FC = () => {
	const { control, errors, handleSubmit } = useForm<IFormData>({ resolver });

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
