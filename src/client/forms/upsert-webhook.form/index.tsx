import { Card, ResourcePath, TextInput } from "@/client/components";
import { UpsertWebhookMutation, useUpsertWebhookMutation, WebhookType } from "@/client/graphql";
import { useOnFormSubmitError, useToast } from "@/client/hooks";
import { getYupValidationResolver } from "@/client/utils";
import { Button } from "@blueprintjs/core";
import classnames from "classnames";
import Link from "next/link";
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

			if (!webhook) {
				toaster.show({ intent: "danger", message: "Form submission unsuccessful" });

				return;
			}

			toaster.show({ intent: "success", message: "Webhook was successfully created" });
		},
		[onFormSubmitError, stockPortfolioId, toaster, upsertWebhook]
	);

	return (
		<Card
			className={classnames(classes.root, className)}
			title={
				<ResourcePath className={classes.title}>
					<ResourcePath.Part
						href={`/stock-portfolios/${stockPortfolioId}/settings/webhooks`}
						text="Webhooks"
					/>
					<ResourcePath.Part
						href={`/stock-portfolios/${stockPortfolioId}/settings/webhooks/new`}
						text="Add webhook"
					/>
				</ResourcePath>
			}
		>
			<div>
				<div className={classes.section}>
					<p>
						We&apos;ll send a <code className={classes.code}>POST</code> request to the
						URL below, with a payload that is structured depending on the
						webhook-trigger selected. More information at{" "}
						{/** TODO. Add developer documentation */}
						<Link href="">
							<a>our developer documentation</a>
						</Link>
						.
					</p>
				</div>
				<form className={classes.section} onSubmit={handleSubmit(onSubmit)}>
					<div className={classes.inputsContainer}>
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
					</div>
					<Button intent="primary" text="Save webhook" type="submit" />
				</form>
			</div>
		</Card>
	);
};
