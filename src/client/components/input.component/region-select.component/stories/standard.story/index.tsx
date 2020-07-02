import { Button } from "@/client/components/button.component";
import { RegionSelect } from "@/client/components/input.component/region-select.component";
import { yupResolver } from "@hookform/resolvers";
import { action } from "@storybook/addon-actions";
import React, { FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface IFormData {
	state: string;
}

const resolver = yupResolver<IFormData>(
	yup.object().shape({
		state: yup.string().required()
	})
);

export const StandardStory: FC = () => {
	const { control, errors, handleSubmit } = useForm<IFormData>({ resolver });

	const onSubmit = useCallback(handleSubmit(action("onSubmit")), []);

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
