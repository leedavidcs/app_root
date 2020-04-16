import { TextInput } from "@/client/components";
import { UpsertWebhookMutation, useUpsertWebhookMutation, WebhookType } from "@/client/graphql";
import { useOnFormSubmitError, useToast } from "@/client/hooks";
import { getYupValidationResolver } from "@/client/utils";
import { Button } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, useCallback } from "react";
import { ExecutionResult } from "react-apollo";
import { useForm } from "react-hook-form";
import { string } from "yup";
import { useStyles } from "./styles";
import { webhookTypes, WebhookTypeSelect } from "./webhook-type-select.component";

interface IProps {
	className?: string;
	stockPortfolioId: string;
}

interface IFormData {
	name: string;
	url: string;
	type: WebhookType;
}

const validationResolver = getYupValidationResolver<IFormData>(() => ({
	name: string().required("Name is required"),
	url: string().required("Url is required"),
	type: string<WebhookType>()
		.required("Type is required")
		.test({
			message: "Type is invalid",
			test: (value) => webhookTypes.some((type) => type === value.value)
		})
}));

export const UpsertWebhookForm: FC<IProps> = ({ className, stockPortfolioId }) => {
	const classes = useStyles();

	const [upsertWebhook] = useUpsertWebhookMutation();

	const toaster = useToast();

	const { control, errors, handleSubmit, setError } = useForm<IFormData>({ validationResolver });

	const onFormSubmitError = useOnFormSubmitError({ setError });

	const onSubmit = useCallback(
		async ({ name, url, type }: IFormData) => {
			let result: ExecutionResult<UpsertWebhookMutation>;

			try {
				result = await upsertWebhook({ variables: { name, url, stockPortfolioId, type } });
			} catch (err) {
				onFormSubmitError(err);

				return;
			}

			const webhook = result.data?.webhook;

			if (webhook) {
				toaster.show({ intent: "danger", message: "Form submission unsuccessful" });

				return;
			}

			toaster.show({ intent: "success", message: "Webhook was successfully created" });
		},
		[onFormSubmitError, stockPortfolioId, toaster, upsertWebhook]
	);

	return (
		<form className={classnames(classes.root, className)} onSubmit={handleSubmit(onSubmit)}>
			<TextInput
				label="Name"
				labelInfo="(required)"
				name="name"
				error={errors.name?.message}
				control={control}
			/>
			<TextInput
				label="Payload URL"
				labelInfo="(required)"
				name="url"
				error={errors.name?.message}
				control={control}
			/>
			<WebhookTypeSelect
				label="Webhook trigger"
				name="type"
				defaultValue={webhookTypes[0]}
				error={errors.type?.message}
				control={control}
			/>
			<Button text="Submit" type="submit" />
		</form>
	);
};
