import { useSetUser } from "@/client/hooks";
import { NextPage, NextPageContext } from "next";
import { NextRouter, useRouter } from "next/router";
import React from "react";
import { IWithApolloOptions, IWithApolloProps, withApollo } from "./with-apollo.hoc";

export const withAuth = (options: IWithApolloOptions = { ssr: false }) => (
	PageComponent: NextPage<Omit<NextPageContext, keyof IWithApolloProps>>
) => {
	const AuthedPage: NextPage<Omit<NextPageContext, keyof IWithApolloProps>> = (props) => {
		const router: NextRouter = useRouter();
		const [, { user, called, loading }] = useSetUser();

		if (!called || loading) {
			return <>loading...</>;
		}

		if (!user) {
			router.replace("/login");

			return null;
		}

		return <PageComponent {...props} />;
	};

	return withApollo(options)(AuthedPage);
};
