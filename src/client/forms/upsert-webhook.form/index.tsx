import { Alert, TextInput } from "@/client/components";
import {
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

interface IProps {
	className?: string;
	stockPortfolioId: string;
	webhookId?: string;
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

export const UpsertWebhookForm: FC<IProps> = ({ className, stockPortfolioId, webhookId }) => {
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
				if (webhookId) {
					await updateWebhook({ variables: { where: { id: webhookId }, data } });
				} else {
					await createWebhook({ variables: { data } });
				}
			} catch (err) {
				onFormSubmitError(err);
			}
		},
		[createWebhook, onFormSubmitError, stockPortfolioId, updateWebhook, webhookId]
	);

	const onAlertOpen = useCallback(() => setAlertOpen(true), []);
	const onAlertClose = useCallback(() => setAlertOpen(false), []);

	const onDelete = useCallback(() => {
		if (!webhookId) {
			throw new Error("Attempted to delete a webhook without an id");
		}

		deleteWebhook({ variables: { id: webhookId } });
	}, [deleteWebhook, webhookId]);

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
					<Button
						intent="primary"
						text={`${typeof webhookId === "string" ? "Update" : "Create"} webhook`}
						type="submit"
					/>
					{webhookId && (
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
