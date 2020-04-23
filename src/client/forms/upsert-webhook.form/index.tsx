import { Alert, TextInput } from "@/client/components";
import {
	GetWebhookQuery,
	useCreateWebhookMutation,
	useDeleteWebhookMutation,
	useSetToastsMutation,
	useUpdateWebhookMutation,
	WebhookType
} from "@/client/graphql";
import { useOnFormSubmitError, useToast } from "@/client/hooks";
import { getYupValidationResolver } from "@/client/utils";
import { Button } from "@blueprintjs/core";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { useStyles } from "./styles";
import { webhookTypes, WebhookTypeSelect } from "./webhook-type-select.component";

type Webhook = NonNullable<GetWebhookQuery["webhook"]>;

interface IProps {
	className?: string;
	stockPortfolioId: string;
	webhook?: Webhook;
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

// Populate initial form (for update)
export const UpsertWebhookForm: FC<IProps> = ({ className, stockPortfolioId, webhook }) => {
	const classes = useStyles();
	const toaster = useToast();
	const router: NextRouter = useRouter();

	const [alertOpen, setAlertOpen] = useState<boolean>(false);

	const [setToasts] = useSetToastsMutation({
		onCompleted: () => router.push(`/stock-portfolios/${stockPortfolioId}/settings/webhooks`)
	});

	const [createWebhook] = useCreateWebhookMutation({
		onCompleted: () => {
			toaster.show({ intent: "success", message: "Webhook was successfully created" });
		}
	});
	const [updateWebhook] = useUpdateWebhookMutation({
		onCompleted: () => {
			toaster.show({ intent: "success", message: "Webhook was successfully updated" });
		}
	});
	const [deleteWebhook] = useDeleteWebhookMutation({
		onCompleted: () => {
			setToasts({
				variables: {
					toasts: [{ intent: "success", message: "Webhook was successfully deleted" }]
				}
			});
		}
	});

	const { control, errors, handleSubmit, setError } = useForm<IFormData>({ validationResolver });

	const onFormSubmitError = useOnFormSubmitError<IFormData>({
		onBadUserInput: (invalidArgs) => setError(invalidArgs)
	});

	const onSubmit = useCallback(
		async (formData: IFormData) => {
			const data = {
				...formData.data,
				stockPortfolio: { connect: { id: stockPortfolioId } }
			};

			try {
				if (webhook) {
					await updateWebhook({ variables: { where: { id: webhook.id }, data } });
				} else {
					await createWebhook({ variables: { data } });
				}
			} catch (err) {
				onFormSubmitError(err);
			}
		},
		[createWebhook, onFormSubmitError, stockPortfolioId, updateWebhook, webhook]
	);

	const onAlertOpen = useCallback(() => setAlertOpen(true), []);
	const onAlertClose = useCallback(() => setAlertOpen(false), []);

	const onDelete = useCallback(() => {
		if (!webhook) {
			throw new Error("Attempted to delete a webhook without an id");
		}

		deleteWebhook({ variables: { id: webhook.id } });
	}, [deleteWebhook, webhook]);

	return (
		<>
			<div className={className}>
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
							defaultValue={webhook?.name}
							label="Name"
							labelInfo="(required)"
							name="data.name"
							error={errors.data?.name?.message}
							control={control}
						/>
						<TextInput
							defaultValue={webhook?.url}
							label="Payload URL"
							labelInfo="(required)"
							name="data.url"
							error={errors.data?.url?.message}
							control={control}
						/>
						<WebhookTypeSelect
							defaultValue={webhook?.type ?? webhookTypes[0]}
							label="Webhook trigger"
							name="data.type"
							error={errors.data?.type?.message}
							control={control}
						/>
					</div>
					<Button
						intent="primary"
						text={`${webhook ? "Update" : "Create"} webhook`}
						type="submit"
					/>
					{webhook && (
						<Button
							className={classes.deleteBtn}
							icon="trash"
							intent="danger"
							onClick={onAlertOpen}
							text="Delete"
						/>
					)}
				</form>
			</div>
			<Alert
				cancelButtonText="Cancel"
				confirmButtonText="Delete"
				icon="trash"
				intent="danger"
				isOpen={alertOpen}
				onClose={onAlertClose}
				onConfirm={onDelete}
			>
				<>
					<p>You are about to delete this Webhook. This action cannot be undone.</p>
					<p>Do you wish to continue?</p>
				</>
			</Alert>
		</>
	);
};
