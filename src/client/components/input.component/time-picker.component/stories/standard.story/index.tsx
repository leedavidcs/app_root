import { Button } from "@/client/components/button.component";
import { TimePicker } from "@/client/components/input.component/time-picker.component";
import { yupResolver } from "@hookform/resolvers";
import { action } from "@storybook/addon-actions";
import { getHours } from "date-fns";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const MIN_HOURS = 12;

interface IFormData {
	mockTimePicker: Date;
}

const resolver = yupResolver<IFormData>(
	yup.object().shape({
		mockTimePicker: yup.date().test({
			message: "Hours must be greater than 12",
			test: (value) => getHours(value) > MIN_HOURS
		})
	})
);

export const StandardStory: FC = () => {
	const { control, errors, handleSubmit } = useForm<IFormData>({ resolver });

	return (
		<form onSubmit={handleSubmit(action("onSubmit"))}>
			<TimePicker
				control={control}
				error={errors.mockTimePicker?.message}
				label="Time Picker"
				labelInfo="(with form)"
				name="mockTimePicker"
			/>
			<Button text="Submit" type="submit" />
		</form>
	);
};
