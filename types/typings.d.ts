declare module "*.graphql" {
	import { DocumentNode } from "graphql";
	const defaultDocument: DocumentNode;

	export default defaultDocument;
}

declare type LocalResolver<TSource, TContext, TArgs> = (
	parent: TSource,
	args: TArgs,
	context: TContext
) => any;

declare type Maybe<T> = T | null | undefined;
