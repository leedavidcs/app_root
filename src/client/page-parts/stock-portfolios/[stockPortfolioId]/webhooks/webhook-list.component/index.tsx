import { List } from "@/client/components";
import { GetWebhooksQuery } from "@/client/graphql";
import { Classes } from "@blueprintjs/core";
import classnames from "classnames";
import { range } from "lodash";
import React, { FC, memo } from "react";
import { useStyles } from "./styles";

const LOADING_ELEMENTS = 3;

interface IProps {
	className?: string;
	loading?: boolean;
	webhooks: Maybe<GetWebhooksQuery["webhooks"]>;
}

export const WebhookList: FC<IProps> = memo(({ className, loading, webhooks }) => {
	const classes = useStyles();

	if (loading || !webhooks) {
		return (
			<List className={className} divider="full">
				{range(LOADING_ELEMENTS).map((__, i) => (
					<List.Item
						key={i}
						text={<div className={classnames(classes.loadName, Classes.SKELETON)} />}
						info={<div className={classnames(classes.loadUrl, Classes.SKELETON)} />}
					/>
				))}
			</List>
		);
	}

	return (
		<List className={className} divider="full">
			{webhooks.map(({ id, name, url }) => (
				<List.Item key={id} text={name} info={url} />
			))}
		</List>
	);
});

WebhookList.displayName = "WebhookList";
