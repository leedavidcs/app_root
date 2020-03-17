import { GetViewerDocument, GetViewerQuery } from "@/client/graphql";
import HttpStatus from "http-status-codes";
import { NextPage, NextPageContext } from "next";
import React from "react";
import { withApollo } from "./with-apollo.hoc";

const addUserToContext = (
	user: GetViewerQuery["viewer"],
	ctx: NextPageContext
): NextPageContext => ({
	...ctx,
	user
});

export const withAuth = <P extends Record<string, any>>() => (PageComponent: NextPage<P>) => {
	const AuthedPage: NextPage<P, any> = (props) => <PageComponent {...props} />;

	AuthedPage.getInitialProps = async (ctx: NextPageContext) => {
		const { apolloClient, res } = ctx;

		const { data } = await apolloClient
			.query<GetViewerQuery>({ query: GetViewerDocument })
			.catch(() => ({ data: { viewer: null } }));

		const user = data.viewer;

		if (!user) {
			res?.writeHead(HttpStatus.SEE_OTHER, { Location: "/login" });
			res?.end();

			return {};
		}

		const newCtx: NextPageContext = addUserToContext(user, ctx);
		const pageProps = await PageComponent.getInitialProps?.(newCtx);

		return { ...pageProps };
	};

	return withApollo<P>({ ssr: true })(AuthedPage);
};
