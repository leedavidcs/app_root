import { Button } from "@/client/components/button.component";
import { RegionSelect } from "@/client/components/input.component/region-select.component";
import { getYupValidationResolver } from "@/client/utils";
import { action } from "@storybook/addon-actions";
import React, { FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import { string } from "yup";

interface IFormData {
	state: string;
}

const validationResolver = getYupValidationResolver(() => ({
	state: string().required()
}));

export const StandardStory: FC = () => {
	const { control, errors, handleSubmit } = useForm<IFormData>({ validationResolver });

	const onSubmit = useCallback(
		handleSubmit((data) => action("onSubmit")(data)),
		[]
	);

	return (
		<form onSubmit={onSubmit}>
			<RegionSelect
				control={control}
				country="US"
				error={errors.state?.message}
				label="State"
				name="state"
			/>
			<Button text="Submit" type="submit" />
		</form>
	);
};
