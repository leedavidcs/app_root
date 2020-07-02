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

declare type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends Array<infer U>
		? Array<DeepPartial<U>>
		: T[P] extends ReadonlyArray<infer U>
			? ReadonlyArray<DeepPartial<U>>
			: DeepPartial<T[P]>
};

declare type MaybePromise<T> = Promise<T> | T;

declare type UnPromise<T> = T extends Promise<infer U> ? U : T;
declare type UnArray<T> = T extends (infer U)[] ? U : T;

declare type JSONPrimitive = string | number | boolean | null;
declare type JSONValue = JSONPrimitive | JSONObject | JSONArray;
declare type JSONObject = { [member: string]: JSONValue };
declare interface JSONArray extends Array<JSONValue> {}
