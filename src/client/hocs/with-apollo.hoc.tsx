import { ModalProvider } from "@/client/components";
import { createApolloClient } from "@/client/graphql";
import { Layout } from "@/client/page-parts/_app";
import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import React from "react";
import { ApolloProvider } from "react-apollo";

/* eslint-disable no-console */

export interface IWithApolloOptions {
	ssr: boolean;
}

export interface IWithApolloProps {
	apolloClient?: ApolloClient<NormalizedCacheObject>;
	apolloState?: NormalizedCacheObject;
}

/**
 * @description For the client, the apollo client is stored in the following variable, to prevent
 * the client from reinitializing between page transitions.
 */
let clientSideApolloClient: Maybe<ApolloClient<NormalizedCacheObject>> = null;

const initApolloClient = (
	initialState: NormalizedCacheObject
): ApolloClient<NormalizedCacheObject> => {
	const isBrowser = typeof window !== "undefined";

	/**
	 * @description Ensure a new client is created for every server-side request, so that data is
	 *     not shared between connections
	 */
	if (!isBrowser) {
		return createApolloClient(initialState);
	}

	/** @description Reuse the client on the client-side */
	if (!clientSideApolloClient) {
		clientSideApolloClient = createApolloClient(initialState);
	}

	return clientSideApolloClient;
};

const initOntoContext = (ctx: NextPageContext): NextPageContext => {
	const newApolloClient: ApolloClient<NormalizedCacheObject> =
		ctx.apolloClient || initApolloClient(ctx.apolloState);

	ctx.apolloClient = newApolloClient;

	return ctx;
};

const preRunGraphQLQueries = async (
	{ AppTree }: NextPageContext,
	pageProps: Record<string, any>,
	apolloClient: ApolloClient<NormalizedCacheObject>
) => {
	try {
		/**
		 * @description Import `@apollo/react-ssr` dynamically. To avoid including this in
		 * the client-side bundle
		 */
		const { getDataFromTree } = await import("@apollo/react-ssr");

		await getDataFromTree(<AppTree pageProps={{ ...pageProps, apolloClient }} />);
	} catch (err) {
		/**
		 * @description Prevent Apollo Client GraphQL errors from crashing SSR.
		 *     Handle them in components via the data.error prop:
		 * @see (@link https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error)
		 */
		console.error("Error while running `getDataFromTree`", err);
	}

	/**
	 * @description `getDataFromTree` does not call `componentWillUnmount`
	 *     head side effect therefore needs to be cleared manually
	 */
	Head.rewind();
};

const getInitialProps = async <P extends Record<string, any>, IP extends Record<string, any>>(
	PageComponent: NextPage<P, IP>,
	ctx: NextPageContext,
	options: IWithApolloOptions
): Promise<IWithApolloProps & IP> => {
	const { apolloClient } = initOntoContext(ctx);

	const pageProps: IP = ((await PageComponent.getInitialProps?.(ctx)) || {}) as IP;
	const apolloState: NormalizedCacheObject = apolloClient.cache.extract();

	const isBrowser = typeof window !== "undefined";

	if (isBrowser) {
		return { ...pageProps, apolloState };
	}

	/** @description When redirecting, the response is finished. No need in continuing to render */
	if (ctx.res?.finished) {
		return pageProps;
	}

	/** @description Pre-run all GraphQL queries, for SSR */
	if (options.ssr) {
		await preRunGraphQLQueries(ctx, pageProps, apolloClient);
	}

	return { ...pageProps, apolloState };
};

export const withApollo = <
	P extends Record<string, any> = any,
	IP extends Record<string, any> = any
>(
	options: IWithApolloOptions = { ssr: true }
) => (PageComponent: NextPage<P, IP>): NextPage<P, IWithApolloProps & IP> => {
	const WithApollo: NextPage<P, IWithApolloProps & IP> = ({
		apolloClient,
		apolloState,
		...pageProps
	}) => {
		const client: ApolloClient<NormalizedCacheObject> =
			apolloClient || initApolloClient(apolloState);

		return (
			<ApolloProvider client={client}>
				<ModalProvider>
					<Layout>
						<PageComponent {...(pageProps as P)} />
					</Layout>
				</ModalProvider>
			</ApolloProvider>
		);
	};

	if (options.ssr) {
		WithApollo.getInitialProps = (ctx: NextPageContext) => {
			return getInitialProps<P, IWithApolloProps & IP>(PageComponent, ctx, options);
		};
	}

	return WithApollo;
};
