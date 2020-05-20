import { Alert, Anchor, Button, GraphQLExplorer, TextInput } from "@/client/components";
import {
	GetWebhookDocument,
	useDeleteWebhookMutation,
	useSetToastsMutation,
	useUpsertWebhookMutation,
	Webhook as _Webhook,
	WebhookType
} from "@/client/graphql";
import { useOnFormSubmitError, useToast } from "@/client/hooks";
import { getYupValidationResolver } from "@/client/utils";
import { NextRouter, useRouter } from "next/router";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { string } from "yup";
import { useStyles } from "./styles";
import { webhookTypes, WebhookTypeSelect } from "./webhook-type-select.component";

export { webhookTypeToName } from "./webhook-type-select.component";

type Webhook = Pick<_Webhook, "id" | "url" | "secret" | "type" | "query">;

const WEBHOOKS_API_URL = `${process.env.API_BASE_URL ?? ""}/api/webhooks`;

interface IProps {
	className?: string;
	stockPortfolioId: string;
	webhook?: Webhook;
}

interface IFormData {
	url: string;
	secret: string;
	type: WebhookType;
}

const validationResolver = getYupValidationResolver<IFormData>(() => ({
	url: string()
		.required("Url is required")
		.url("Url is invalid")
		.test({
			message: "Url host localhost is not supported",
			test: (value) => !/(https?:\/\/)?localhost.*$/g.test(value)
		}),
	secret: string(),
	type: string()
		.oneOf<WebhookType>([WebhookType.StockDataRetrieved])
		.required("Type is required")
		.test({
			message: "Type is invalid",
			test: (value) => webhookTypes.some((type) => type === value)
		})
}));

const useOnEditQuery = ({ webhook }: IProps) => {
	const [query, setQuery] = useState<Maybe<string>>(webhook?.query);
	const [isValid, setIsValid] = useState<boolean>(true);

	const onEditQuery = useCallback((newQuery, newIsValid) => {
		setQuery(newQuery);
		setIsValid(newIsValid);
	}, []);

	const states = useMemo(() => ({ query, isValid }), [isValid, query]);

	return [onEditQuery, states] as [typeof onEditQuery, typeof states];
};

// Populate initial form (for update)
export const UpsertWebhookForm: FC<IProps> = (props) => {
	const { className, stockPortfolioId, webhook } = props;

	const classes = useStyles();
	const toaster = useToast();
	const router: NextRouter = useRouter();

	const [alertOpen, setAlertOpen] = useState<boolean>(false);

	const [setToasts] = useSetToastsMutation();

	const [upsertWebhook] = useUpsertWebhookMutation({
		refetchQueries: webhook
			? [{ query: GetWebhookDocument, variables: { where: { id: webhook.id } } }]
			: undefined,
		onCompleted: async (result) => {
			if (webhook) {
				toaster.show({ intent: "success", message: "Webhook was successfully updated" });

				return;
			}

			await setToasts({
				variables: {
					toasts: [
						{
							intent: "success",
							message: `Webhook was successfully created`
						}
					]
				}
			});

			if (!webhook) {
				router.push(`/webhooks/${result.webhook.id}`);
			}
		}
	});

	const [deleteWebhook] = useDeleteWebhookMutation({
		onCompleted: async () => {
			await setToasts({
				variables: {
					toasts: [{ intent: "success", message: "Webhook was successfully deleted" }]
				}
			});

			router.push(`/stock-portfolios/${stockPortfolioId}/settings/webhooks`);
		}
	});

	const { control, errors, handleSubmit, setError } = useForm<IFormData>({
		validationResolver
	});

	const onFormSubmitError = useOnFormSubmitError<IFormData>({
		onBadUserInput: (invalidArgs) => setError(invalidArgs)
	});

	const [onEditQuery, queryStates] = useOnEditQuery(props);

	const onSubmit = useCallback(
		async (formData: IFormData) => {
			if (queryStates.query && !queryStates.isValid) {
				toaster.show({
					intent: "danger",
					message: "GraphQL query is invalid"
				});

				return;
			}

			try {
				await upsertWebhook({
					variables: {
						id: webhook?.id,
						query: queryStates.query,
						secret: formData.secret,
						type: formData.type,
						url: formData.url,
						stockPortfolioId
					}
				});
			} catch (err) {
				onFormSubmitError(err);
			}
		},
		[
			onFormSubmitError,
			queryStates.isValid,
			queryStates.query,
			stockPortfolioId,
			toaster,
			upsertWebhook,
			webhook
		]
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
					<p className={classes.info}>
						We&apos;ll send a <code className={classes.code}>POST</code> request to the
						URL below, with a payload of the data you&apos;ve requested via{" "}
						<Anchor href="https://graphql.org" useLink={false} value="GraphQL" />. More
						information at {/** TODO. Add developer documentation */}
						<Anchor href="" value="our developer documentation" />.
					</p>
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className={classes.section}>
						<div className={classes.inputsContainer}>
							<TextInput
								defaultValue={webhook?.url}
								label="Payload URL"
								labelInfo="(required)"
								name="url"
								error={errors.url?.message}
								control={control}
							/>
							<TextInput
								defaultValue={webhook?.secret ?? ""}
								label="Secret"
								name="secret"
								error={errors.secret?.message}
								control={control}
							/>
							<WebhookTypeSelect
								defaultValue={webhook?.type ?? webhookTypes[0]}
								label="Webhook trigger"
								name="type"
								error={errors.type?.message}
								control={control}
							/>
						</div>
					</div>
					<div className={classes.section}>
						<h2 className={classes.queryTitle}>Webhook data</h2>
						<p className={classes.info}>
							Use{" "}
							<Anchor href="https://graphql.org" useLink={false} value="GraphQL" /> to
							specify the data to be attached to your webhook. If no query is
							specified, your webhook will be triggered without a request body.
						</p>
					</div>
					<div className={classes.section}>
						<GraphQLExplorer
							className={classes.graphqlExplorer}
							defaultQuery={queryStates.query ?? ""}
							onEditQuery={onEditQuery}
							url={WEBHOOKS_API_URL}
						/>
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
					</div>
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
