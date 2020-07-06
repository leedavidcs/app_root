import { Button } from "@/client/components/button.component";
import { TextInput } from "@/client/components/input.component/text-input.component";
import { Paper } from "@/client/components/paper.component";
import { yupResolver } from "@hookform/resolvers";
import { action } from "@storybook/addon-actions";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const MAX_TEXT_LENGTH = 5;

interface IFormData {
	textInput: string;
}

const resolver = yupResolver<IFormData>(
	yup.object().shape({
		textInput: yup.string().required().max(MAX_TEXT_LENGTH)
	})
);

export const StandardStory: FC = () => {
	const { control, errors, handleSubmit } = useForm<IFormData>({ resolver });

	return (
		<Paper>
			<form onSubmit={handleSubmit(action("onSubmit"))}>
				<TextInput
					control={control}
					name="textInput"
					label="Text input"
					labelInfo="(Must be fewer than 5 chars)"
					error={errors.textInput?.message}
					placeholder="placeholder"
				/>
				<Button type="submit" text="Submit" />
			</form>
		</Paper>
	);
};
