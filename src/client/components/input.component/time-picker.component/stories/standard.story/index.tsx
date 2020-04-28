import { TimePicker } from "@/client/components/input.component/time-picker.component";
import { getYupValidationResolver } from "@/client/utils";
import { Button } from "@blueprintjs/core";
import { action } from "@storybook/addon-actions";
import { getHours } from "date-fns";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { date } from "yup";

const MIN_HOURS = 12;

interface IFormData {
	mockTimePicker: Date;
}

const validationResolver = getYupValidationResolver<IFormData>(() => ({
	mockTimePicker: date().test({
		message: "Hours must be greater than 12",
		test: (value) => {
			return getHours(value) > MIN_HOURS;
		}
	})
}));

export const StandardStory: FC = () => {
	const { control, errors, handleSubmit } = useForm<IFormData>({ validationResolver });

	return (
		<form onSubmit={handleSubmit(action("onSubmit"))}>
			<TimePicker
				control={control}
				error={errors.mockTimePicker?.message}
				label="Time Picker"
				labelInfo="(with form)"
				name="mocktimePicker"
			/>
			<Button text="Submit" type="submit" />
		</form>
	);
};
