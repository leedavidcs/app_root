import { CountrySelect } from "@/client/components/input.component/country-select.component";
import { getYupValidationResolver } from "@/client/utils";
import { Button } from "@blueprintjs/core";
import { action } from "@storybook/addon-actions";
import React, { FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import { string } from "yup";

interface IFormData {
	country: string;
}

const validationResolver = getYupValidationResolver<IFormData>(() => ({
	country: string().required()
}));

export const StandardStory: FC = () => {
	const { control, errors, handleSubmit } = useForm<IFormData>({ validationResolver });

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
