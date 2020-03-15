import { GetViewer, Queries } from "@/client/graphql";
import HttpStatus from "http-status-codes";
import { NextPage } from "next";
import React from "react";
import { IWithApolloProps, withApollo } from "./with-apollo.hoc";

export const withAuth = <T extends Record<string, any>>() => (PageComponent: NextPage<T>) => {
	const AuthedPage: NextPage<T, IWithApolloProps> = (props) => <PageComponent {...props} />;

	AuthedPage.getInitialProps = async ({ apolloClient, res }) => {
		const { data } = await apolloClient
			.query<GetViewer>({ query: Queries.GetViewer })
			.catch(() => ({ data: { viewer: null } }));

		const isLoggedIn = Boolean(data.viewer);

		if (!isLoggedIn) {
			res?.writeHead(HttpStatus.SEE_OTHER, { Location: "/login" });
			res?.end();

			return {};
		}

		return {};
	};

	return withApollo<T>({ ssr: true })(AuthedPage);
};
