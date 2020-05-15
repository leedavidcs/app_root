import { Button } from "@/client/components/button.component";
import { Switch } from "@/client/components/input.component/switch.component";
import { Paper } from "@/client/components/paper.component";
import { action } from "@storybook/addon-actions";
import React, { FC } from "react";
import { useForm } from "react-hook-form";

interface IFormData {
	switch: boolean;
}

export const StandardStory: FC = () => {
	const { control, handleSubmit } = useForm<IFormData>();

	return (
		<Paper>
			<form onSubmit={handleSubmit(action("onSubmit"))}>
				<Switch control={control} info="(with info)" label="Click me!" name="switch" />
				<Button type="submit" text="Submit" />
			</form>
		</Paper>
	);
};
