import { Button } from "@/client/components/button.component";
import { Slider } from "@/client/components/input.component/slider.component";
import { getYupValidationResolver } from "@/client/utils";
import { action } from "@storybook/addon-actions";
import React, { FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import { number } from "yup";

const MAX_ALLOWED_VALUE = 7;

interface IFormData {
	story_slider: number;
}

const validationResolver = getYupValidationResolver<IFormData>(() => ({
	story_slider: number().required().max(MAX_ALLOWED_VALUE)
}));

export const StandardStory: FC = () => {
	const { control, errors, handleSubmit } = useForm<IFormData>({ validationResolver });

	const onSubmit = useCallback(
		handleSubmit((data) => action("onSubmit")(data)),
		[]
	);

	return (
		<form onSubmit={onSubmit}>
			<Slider
				control={control}
				error={errors.story_slider?.message}
				label="Must be equal to, or lower than 7"
				name="story_slider"
				withInput={true}
			/>
			<Button intent="primary" text="Submit" type="submit" />
		</form>
	);
};
