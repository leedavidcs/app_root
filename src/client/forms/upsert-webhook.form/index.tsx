import { TextInput } from "@/client/components";
import {
	CreateWebhookMutation,
	UpdateWebhookMutation,
	useCreateWebhookMutation,
	useUpdateWebhookMutation,
	WebhookType
} from "@/client/graphql";
import { useOnFormSubmitError, useToast } from "@/client/hooks";
import { getYupValidationResolver } from "@/client/utils";
import { Button } from "@blueprintjs/core";
import Link from "next/link";
import React, { FC, useCallback } from "react";
import { ExecutionResult } from "react-apollo";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { useStyles } from "./styles";
import { webhookTypes, WebhookTypeSelect } from "./webhook-type-select.component";

type Webhook = CreateWebhookMutation["webhook"];

interface IProps {
	className?: string;
	stockPortfolioId: string;
	operation: "create" | "update";
}

interface IFormData {
	data: {
		name: string;
		url: string;
		type: WebhookType;
	};
}

const validationResolver = getYupValidationResolver<IFormData>(() => ({
	data: object().shape({
		name: string().required("Name is required"),
		url: string()
			.required("Url is required")
			.url("Url is invalid")
			.test({
				message: "Url host localhost is not supported",
				test: (value) => !/(https?:\/\/)?localhost.*$/g.test(value)
			}),
		type: string<WebhookType>()
			.required("Type is required")
			.test({
				message: "Type is invalid",
				test: (value) => webhookTypes.some((type) => type === value)
			})
	})
}));

export const UpsertWebhookForm: FC<IProps> = ({ className, operation, stockPortfolioId }) => {
	const classes = useStyles();
	const toaster = useToast();

	const [createWebhook] = useCreateWebhookMutation();
	const [updateWebhook] = useUpdateWebhookMutation();

	const { control, errors, handleSubmit, setError } = useForm<IFormData>({ validationResolver });

	const onFormSubmitError = useOnFormSubmitError<IFormData>({
		onBadUserInput: (invalidArgs) => setError(invalidArgs)
	});

	const onSubmit = useCallback(
		async (formData: IFormData) => {
			let result: ExecutionResult<CreateWebhookMutation | UpdateWebhookMutation>;

			const where = { stockPortfolioId_name: { stockPortfolioId, name: formData.data.name } };
			const data = {
				...formData.data,
				stockPortfolio: { connect: { id: stockPortfolioId } }
			};

			try {
				switch (operation) {
					case "create":
						result = await createWebhook({ variables: { data } });
						break;
					case "update":
						result = await updateWebhook({ variables: { where, data } });
						break;
					default:
						throw new Error("Invalid operation");
				}
			} catch (err) {
				onFormSubmitError(err);

				return;
			}

			const webhook: Maybe<Webhook> = result.data?.webhook;

			if (!webhook) {
				toaster.show({ intent: "danger", message: "Form submission unsuccessful" });

				return;
			}

			toaster.show({ intent: "success", message: "Webhook was successfully created" });
		},
		[createWebhook, onFormSubmitError, operation, stockPortfolioId, toaster, updateWebhook]
	);

	return (
		<div className={className}>
			<div className={classes.section}>
				<p>
					We&apos;ll send a <code className={classes.code}>POST</code> request to the URL
					below, with a payload that is structured depending on the webhook-trigger
					selected. More information at {/** TODO. Add developer documentation */}
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
						name="data.name"
						error={errors.data?.name?.message}
						control={control}
					/>
					<TextInput
						label="Payload URL"
						labelInfo="(required)"
						name="data.url"
						error={errors.data?.url?.message}
						control={control}
					/>
					<WebhookTypeSelect
						label="Webhook trigger"
						name="data.type"
						defaultValue={webhookTypes[0]}
						error={errors.data?.type?.message}
						control={control}
					/>
				</div>
				<Button intent="primary" text="Save webhook" type="submit" />
			</form>
		</div>
	);
};
