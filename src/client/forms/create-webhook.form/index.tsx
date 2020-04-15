import { TextInput } from "@/client/components";
import { useCreateWebhookMutation, WebhookType } from "@/client/graphql";
import { getYupValidationResolver } from "@/client/utils";
import React, { FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import { string } from "yup";

interface IProps {
	className?: string;
	stockPortfolioId: string;
}

interface IFormData {
	name: string;
	url: string;
}

const validationSchema = () => ({
	name: string().required("Name is required"),
	url: string().required("Url is  required")
});

const validationResolver = getYupValidationResolver<IFormData>(validationSchema);

export const CreateWebhookForm: FC<IProps> = ({ className, stockPortfolioId }) => {
	const [createWebhook] = useCreateWebhookMutation();

	const { control, errors, handleSubmit } = useForm<IFormData>({ validationResolver });

	const onSubmit = useCallback(
		async ({ name, url }: IFormData) => {
			const webhook = await createWebhook({
				variables: {
					name,
					url,
					stockPortfolioId,
					type: WebhookType.StockDataRetrieved
				}
			});
		},
		[createWebhook, stockPortfolioId]
	);

	return (
		<form className={className} onSubmit={handleSubmit(onSubmit)}>
			<TextInput label="Name" name="name" error={errors.name?.message} control={control} />
			<TextInput label="Url" name="url" error={errors.name?.message} control={control} />
		</form>
	);
};
