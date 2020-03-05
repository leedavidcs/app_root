import { createApolloClient } from "@/client/graphql";
import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import { NextComponentType, NextPageContext } from "next";
import App, { AppContext } from "next/app";
import Head from "next/head";
import React from "react";
import { ApolloProvider } from "react-apollo";

/* eslint-disable no-console */

const isDevelopmentMode: boolean = process.env.NODE_ENV === "development";

interface IWithApolloOptions {
	ssr: boolean;
}

interface IWithApolloProps {
	apolloClient: ApolloClient<NormalizedCacheObject>;
	apolloState: NormalizedCacheObject;
	[pageProp: string]: any;
}

/**
 * @description For the client, the apollo client is stored in the following variable, to prevent
 * the client from reinitializing between page transitions.
 */
let clientSideApolloClient: Maybe<ApolloClient<NormalizedCacheObject>> = null;

const isAppContext = (ctx: AppContext | NextPageContext): ctx is AppContext => {
	return Object.prototype.hasOwnProperty.call(ctx, "ctx");
};

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

	/**
	 * @description Reuse the client on the client-side
	 */
	if (!clientSideApolloClient) {
		clientSideApolloClient = createApolloClient(initialState);
	}

	return clientSideApolloClient;
};

const initOntoContext = <T extends AppContext | NextPageContext>(ctx: T): T => {
	if (isDevelopmentMode && isAppContext(ctx)) {
		console.warn(
			"Warning: You have opted-out of Automatic Static Optimization due to `withApollo` in \
			`pages/_app`.\n\
			Read more: https://err.sh/next.js/opt-out-auto-static-optimization\n"
		);
	}

	const newApolloClient: ApolloClient<NormalizedCacheObject> =
		ctx.apolloClient || initApolloClient(ctx.apolloState);

	ctx.apolloClient = newApolloClient;

	return ctx;
};

const runWrappedGetInitialProps = async (
	PageComponent: NextComponentType,
	ctx: AppContext | NextPageContext
): Promise<Record<string, any>> => {
	const pageProps = isAppContext(ctx)
		? await App.getInitialProps(ctx)
		: (await PageComponent.getInitialProps?.(ctx)) || {};

	return pageProps;
};

const preRunGraphQLQueries = async (
	{ AppTree }: AppContext,
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

const getInitialProps = async (
	PageComponent: NextComponentType,
	ctx: AppContext | NextPageContext,
	options: IWithApolloOptions
): Promise<Record<string, any>> => {
	const { apolloClient } = initOntoContext(ctx);

	const pageProps: Record<string, any> = await runWrappedGetInitialProps(PageComponent, ctx);
	const apolloState: NormalizedCacheObject = apolloClient.cache.extract();

	const isBrowser = typeof window !== "undefined";

	if (isBrowser) {
		return { ...pageProps, apolloState };
	}

	/**
	 * @description When redirecting, the response is finished. No need in continuing to render
	 */
	if (!isAppContext(ctx) && ctx.res?.finished) {
		return pageProps;
	}

	/**
	 * @description Pre-run all GraphQL queries, for SSR
	 */
	if (isAppContext(ctx) && options.ssr) {
		await preRunGraphQLQueries(ctx, pageProps, apolloClient);
	}

	return { ...pageProps, apolloState };
};

export const withApollo = (options: IWithApolloOptions = { ssr: false }) => (
	PageComponent: NextComponentType
) => {
	const WithApollo: NextComponentType<NextPageContext, {}, IWithApolloProps> = ({
		apolloClient,
		apolloState,
		...pageProps
	}) => {
		const client: ApolloClient<NormalizedCacheObject> =
			apolloClient || initApolloClient(apolloState);

		return (
			<ApolloProvider client={client}>
				<PageComponent {...pageProps} />
			</ApolloProvider>
		);
	};

	if (options.ssr) {
		WithApollo.getInitialProps = (ctx: AppContext | NextPageContext) => {
			return getInitialProps(PageComponent, ctx, options);
		};
	}

	return WithApollo;
};
