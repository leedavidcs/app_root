import { Button, ClassesSkeleton, List } from "@/client/components";
import { GetWebhooksQuery, useDeleteWebhookMutation } from "@/client/graphql";
import { ApolloQueryResult } from "@apollo/client";
import classnames from "classnames";
import { range } from "lodash";
import React, { FC, memo, MouseEvent, useCallback } from "react";
import { useStyles } from "./styles";

type Webhook = GetWebhooksQuery["webhooks"][number];

const LOADING_ELEMENTS = 3;

interface IProps {
	className?: string;
	loading?: boolean;
	webhooks: Maybe<readonly Webhook[]>;
	refetch?: () => Promise<ApolloQueryResult<GetWebhooksQuery>>;
}

const useOnDelete = ({ refetch }: IProps) => {
	const [deleteWebhook] = useDeleteWebhookMutation({
		onCompleted: () => refetch?.()
	});

	return useCallback(
		(webhook: Webhook) => (event: MouseEvent) => {
			event.preventDefault();
			event.stopPropagation();

			deleteWebhook({ variables: { id: webhook.id } });
		},
		[deleteWebhook]
	);
};

export const WebhookList: FC<IProps> = memo((props) => {
	const { className, loading, webhooks } = props;

	const classes = useStyles();

	const onDelete = useOnDelete(props);

	if (loading || !webhooks) {
		return (
			<List className={className} divider="full">
				{range(LOADING_ELEMENTS).map((__, i) => (
					<List.Item
						key={i}
						text={<div className={classnames(classes.loadUrl, ClassesSkeleton)} />}
					/>
				))}
			</List>
		);
	}

	return (
		<List className={className} divider="full">
			{webhooks.map((webhook) => {
				const { id, url } = webhook;

				return (
					<List.Item
						key={id}
						href={`/webhooks/${id}`}
						text={<span className={classes.url}>{url}</span>}
					>
						<Button
							icon="trash"
							intent="danger"
							onClick={onDelete(webhook)}
							text="Delete"
						/>
					</List.Item>
				);
			})}
		</List>
	);
});

WebhookList.displayName = "WebhookList";
