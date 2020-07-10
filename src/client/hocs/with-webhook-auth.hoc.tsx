import { GetWebhookDocument, GetWebhookQuery, GetWebhookQueryVariables } from "@/client/graphql";
import HttpStatus from "http-status-codes";
import { NextPage, NextPageContext } from "next";
import ErrorPage from "next/error";
import React from "react";
import { withAuth } from "./with-auth.hoc";

type Webhook = NonNullable<GetWebhookQuery["webhook"]>;

interface IOptions {
	requireOwner?: boolean;
}

interface IPageProps {
	webhook: Webhook;
	[key: string]: any;
}

interface IInitialProps {
	errorCode?: number;
	errorTitle?: string;
	webhook: Webhook;
}

/**
 * !important - Route query must have [webhookId]
 *
 * @description Requires that a user is authenticated, and that the user is an ower of the
 *     stock-portfolio that the webhook is created for.
 * @author David Lee
 * @date April 21, 2020
 */
export const withWebhookAuth = <P extends IPageProps, IP = any>(
	options: IOptions = { requireOwner: true }
) => (PageComponent: NextPage<P, IP>) => {
	const AuthedPage: NextPage<P & IInitialProps, any> = (props) => {
		const { errorCode, errorTitle, webhook } = props;

		if (errorCode) {
			return <ErrorPage statusCode={errorCode} title={errorTitle} />;
		}

		return <PageComponent {...props} webhook={webhook} />;
	};

	AuthedPage.getInitialProps = async (ctx: NextPageContext) => {
		const { apolloClient, query, user } = ctx;

		const { webhookId } = query;

		const { data } = await apolloClient.query<GetWebhookQuery, GetWebhookQueryVariables>({
			query: GetWebhookDocument,
			variables: {
				where: {
					id: webhookId as string
				}
			}
		});

		const webhook: Maybe<Webhook> = data?.webhook;

		if (!webhook) {
			return { errorCode: HttpStatus.NOT_FOUND, errorTitle: "Resource was not found" };
		}

		const isCreator: boolean = user?.id === webhook.stockPortfolio.user.id;

		if (options.requireOwner && !isCreator) {
			return {
				errorCode: HttpStatus.FORBIDDEN,
				errorTitle: "Access to resource is forbidden"
			};
		}

		const pageProps = await PageComponent.getInitialProps?.(ctx);

		return { ...pageProps, webhook };
	};

	return withAuth<any>()(AuthedPage);
};
