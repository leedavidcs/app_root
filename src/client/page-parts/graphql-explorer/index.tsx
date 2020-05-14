import { useModule } from "@/client/hooks";
import { HttpLink } from "apollo-boost";
import classnames from "classnames";
import { FetcherParams, FetcherResult } from "graphiql/dist/components/GraphiQL";
import { GraphQLError, GraphQLSchema, parse, validate } from "graphql";
import { introspectSchema } from "graphql-tools";
import React, { CSSProperties, FC, useCallback, useEffect, useMemo, useState } from "react";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	onEditQuery?: (query?: string) => void;
	onToggleDocs?: (isOpen: boolean) => void;
	onValidQuery?: (query: string) => void;
	url: string;
	style?: CSSProperties;
}

export const GraphQLExplorer: FC<IProps> = ({
	className,
	onEditQuery,
	onToggleDocs,
	onValidQuery,
	style,
	url
}) => {
	/** Import GraphiQL within function, because `codemirror` cannot be imported in SSR */
	const GraphiQL = useModule(() => import("graphiql"))?.GraphiQL;

	const classes = useStyles();

	const [schema, setSchema] = useState<GraphQLSchema | null>();

	const fetcher = useCallback(
		async (graphQLParams: FetcherParams): Promise<FetcherResult> => {
			return fetch(url, {
				method: "post",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(graphQLParams)
			}).then<FetcherResult>((response) => response.json());
		},
		[url]
	);

	const httpLink = useMemo(() => new HttpLink({ uri: url }), [url]);

	useEffect(() => {
		introspectSchema(httpLink).then((result) => setSchema(result));
	}, [httpLink]);

	const validateQuery = useCallback(
		(query: string): boolean => {
			const errors: readonly GraphQLError[] = validate(schema!, parse(query));

			return errors.length === 0;
		},
		[schema]
	);

	const onChangeQuery = useCallback(
		(query?: string) => {
			onEditQuery?.(query);

			if (query && validateQuery(query)) {
				onValidQuery?.(query);
			}
		},
		[onEditQuery, onValidQuery, validateQuery]
	);

	if (!GraphiQL || !schema) {
		return null;
	}

	return (
		<div className={classnames(classes.root, className)} style={style}>
			<GraphiQL
				defaultQuery=""
				docExplorerOpen={false}
				editorTheme="material-darker"
				fetcher={fetcher}
				onEditQuery={onChangeQuery}
				onToggleDocs={onToggleDocs}
				query=""
			>
				<GraphiQL.Logo>GraphQL Explorer</GraphiQL.Logo>
				<GraphiQL.Toolbar />
			</GraphiQL>
		</div>
	);
};
