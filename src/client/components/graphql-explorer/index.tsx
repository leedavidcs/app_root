import { useModule } from "@/client/hooks";
import { HttpLink } from "@apollo/client";
import { introspectSchema } from "@graphql-tools/wrap";
import classnames from "classnames";
import { FetcherParams, FetcherResult } from "graphiql/dist/components/GraphiQL";
import { GraphQLError, GraphQLSchema, parse, validate } from "graphql";
import React, {
	CSSProperties,
	FC,
	memo,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState
} from "react";
import { useStyles } from "./styles";

const IS_STORYBOOK = process.env.IS_STORYBOOK === "true";

interface IProps {
	className?: string;
	defaultQuery?: string;
	defaultDocsOpen?: boolean;
	onEditQuery?: (query: Maybe<string>, isValid: boolean) => void;
	onToggleDocs?: (isOpen: boolean) => void;
	url: string;
	style?: CSSProperties;
	title?: ReactNode;
}

export const GraphQLExplorer: FC<IProps> = memo(
	({
		className,
		defaultQuery = "",
		defaultDocsOpen = false,
		onEditQuery,
		onToggleDocs,
		style,
		title = "GraphQL Explorer",
		url
	}) => {
		/**
		 * !HACK
		 * @description Import GraphiQL within function, because lazy/dynamic loading breaks the
		 *     import, but lazy loading is still desireable.
		 * @author David Lee
		 * @date July 06, 2020
		 */
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
			/**
			 * !HACK
			 * @description `introspectSchema` is type-incompatible with ApolloLink from
			 *     @apollo/client, though it still works. Castsing as`any` for now
			 * @author David Lee
			 * @date May 16, 2020
			 */
			introspectSchema(httpLink as any).then(setSchema);
		}, [httpLink]);

		const validateQuery = useCallback(
			(query: string): boolean => {
				try {
					const errors: readonly GraphQLError[] = validate(schema!, parse(query));

					return errors.length === 0;
				} catch {
					return false;
				}
			},
			[schema]
		);

		const onChangeQuery = useCallback(
			(query?: string) => {
				const isValid = Boolean(query && validateQuery(query));

				onEditQuery?.(query, isValid);
			},
			[onEditQuery, validateQuery]
		);

		if (!GraphiQL) {
			return null;
		}

		if (!schema && !IS_STORYBOOK) {
			return null;
		}

		return (
			<div className={classnames(classes.root, className)} style={style}>
				<GraphiQL
					docExplorerOpen={defaultDocsOpen}
					editorTheme="lesser-dark"
					fetcher={fetcher}
					onEditQuery={onChangeQuery}
					onToggleDocs={onToggleDocs}
					query={defaultQuery}
					schema={schema!}
				>
					<GraphiQL.Logo>{title}</GraphiQL.Logo>
					<GraphiQL.Toolbar />
				</GraphiQL>
			</div>
		);
	}
);

GraphQLExplorer.displayName = "GraphQLExplorer";
