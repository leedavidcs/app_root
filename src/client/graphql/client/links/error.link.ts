import { RefreshAccessTokenMutationVariables, TokenPayload } from "@/client/graphql";
import { RefreshAccessTokenDocument } from "@/client/graphql/generated";
import { getRefreshToken, getToken, writeCookie } from "@/server/authentication/cookie-utils";
import {
	ApolloLink,
	FetchResult,
	Observable,
	Operation,
	ServerError,
	ServerParseError
} from "@apollo/client";
import { onError } from "@apollo/link-error";

import { print } from "graphql/language";
import HttpStatus from "http-status-codes";

/* eslint-disable no-console */

const BASE_GRAPHQL_URL = `${process.env.API_BASE_URL}/api/graphql`;

const isServerError = (value: any): value is ServerError | ServerParseError => {
	return Boolean(value.statusCode);
};

/**
 * @description Refreshes the access token, using the current refreshToken.
 * @returns The new access token
 */
const doRefreshToken = async (): Promise<string | null> => {
	const oldToken: Maybe<string> = getToken();
	const oldRefreshToken: Maybe<string> = getRefreshToken();

	if (!oldRefreshToken) {
		return null;
	}

	const variables: RefreshAccessTokenMutationVariables = {
		input: { refreshToken: oldRefreshToken }
	};
	const tokenRequest = await fetch(BASE_GRAPHQL_URL, {
		body: JSON.stringify({
			mutation: print(RefreshAccessTokenDocument),
			variables
		}),
		headers: {
			Accept: "application/json",
			Authorization: oldToken ? `Bearer ${oldToken}` : "",
			"Content-Type": "application/json"
		},
		method: "POST"
	});

	if (tokenRequest.status !== HttpStatus.OK) {
		return null;
	}

	const { refreshToken: newRefreshToken, token }: TokenPayload = await tokenRequest.json();

	writeCookie(token, {
		refreshToken: newRefreshToken
	});

	return token;
};

const onRefreshToken = new Observable<string | null>((subscriber) => {
	const performRefreshToken = async () => {
		try {
			const value = await doRefreshToken();

			subscriber.next(value);
			subscriber.complete();
		} catch (err) {
			subscriber.error(err);
		}
	};

	performRefreshToken();
});

const handleNetworkError = (
	networkError: ServerError | ServerParseError
): Observable<string | null> | null => {
	const { statusCode } = networkError;

	if (statusCode === HttpStatus.UNAUTHORIZED) {
		return onRefreshToken;
	}

	console.error(`[Network error]: ${networkError}`);

	return null;
};

const handleGraphQLErrors = (graphqlErrors: readonly any[]): void => {
	graphqlErrors.forEach(({ message, locations, path }) => {
		console.error(
			`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
		);
	});
};

const setNewAuthorizationHeader = (operation: Operation, newToken: string): void => {
	const oldHeaders = operation.getContext().headers;

	operation.setContext({ headers: { ...oldHeaders, Authorization: `Bearer ${newToken}` } });
};

export const ErrorLink: ApolloLink = onError(
	({ operation, forward, graphQLErrors, networkError }): Observable<FetchResult> | void => {
		if (graphQLErrors) {
			handleGraphQLErrors(graphQLErrors);
		}

		if (!networkError || !isServerError(networkError)) {
			return;
		}

		const networkErrorResult: Observable<string | null> | null = handleNetworkError(
			networkError
		);

		if (!networkErrorResult) {
			return;
		}

		return networkErrorResult.flatMap((newToken) => {
			if (newToken) {
				setNewAuthorizationHeader(operation, newToken);
			}

			return forward(operation);
		});
	}
);
