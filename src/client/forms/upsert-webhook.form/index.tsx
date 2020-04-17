import { Paper, TextInput } from "@/client/components";
import { UpsertWebhookMutation, useUpsertWebhookMutation, WebhookType } from "@/client/graphql";
import { useBreakpoint, useOnFormSubmitError, useToast } from "@/client/hooks";
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
	const toaster = useToast();

	const isUpSmBreakpoint = useBreakpoint("up", "sm");

	const [upsertWebhook] = useUpsertWebhookMutation();

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
			<Paper className={classes.inputsContainer}>
				<TextInput
					label="Name"
					labelInfo="(required)"
					name="name"
					inline={isUpSmBreakpoint}
					error={errors.name?.message}
					control={control}
				/>
				<TextInput
					label="Payload URL"
					labelInfo="(required)"
					name="url"
					inline={isUpSmBreakpoint}
					error={errors.name?.message}
					control={control}
				/>
				<WebhookTypeSelect
					label="Webhook trigger"
					name="type"
					inline={isUpSmBreakpoint}
					defaultValue={webhookTypes[0]}
					error={errors.type?.message}
					control={control}
				/>
			</Paper>
			<Button intent="primary" text="Save webhook" type="submit" />
		</form>
	);
};
