import { Button } from "@/client/components/button.component";
import { CountrySelect } from "@/client/components/input.component/country-select.component";
import { yupResolver } from "@hookform/resolvers";
import { action } from "@storybook/addon-actions";
import React, { FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import yup from "yup";

interface IFormData {
	country: string;
}

const resolver = yupResolver<IFormData>(
	yup.object().shape({
		country: yup.string().required()
	})
);

export const StandardStory: FC = () => {
	const { control, errors, handleSubmit } = useForm<IFormData>({ resolver });

	const onSubmit = useCallback(
		handleSubmit((data) => action("onSubmit")(data)),
		[]
	);

	return (
		<form onSubmit={onSubmit}>
			<CountrySelect
				control={control}
				error={errors.country?.message}
				inline={true}
				label="Country"
				name="country"
				placeholder="Country"
			/>
			<Button text="Submit" type="submit" />
		</form>
	);
};
