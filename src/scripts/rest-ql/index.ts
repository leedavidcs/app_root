import { map } from "blend-promise-utils";
import { head, merge, upperFirst } from "lodash";
import { RestQLClient } from "./client";
import { generateNexus } from "./generate-nexus";

type AstNodeKind = "Root" | "RequestArgs" | "Provider" | "Field" | "Property" | "Arg";

export interface IAstNode<TKind extends AstNodeKind> {
	__type: string;
	__kind: TKind;
	__description?: string;
}

type EvaledChildAst<T> = T extends object
	? { [P in keyof T]: T[P] extends AstResult<infer U> ? U : never }
	: never;

interface IWithArgsAstNodes<T extends object = any> {
	__args?: { [name in keyof T]: IArgAstNode<T[name]> };
}

interface IWithPropertiesAstNodes {
	__properties?: { [name: string]: IPropertyAstNode };
}

interface IRootAstNode extends IAstNode<"Root"> {
	__requestArgs: IRequestArgsAstNode;
	__providers: { [name: string]: IProviderAstNode };
}

export interface IArgAstNode<T = any> extends IAstNode<"Arg">, IWithPropertiesAstNodes {
	__list?: boolean;
	__nullable?: boolean;
	__mock: T;
}

export interface IRequestArgsAstNode<TRequestArgs extends object = any>
	extends IAstNode<"RequestArgs">,
		IWithArgsAstNodes<TRequestArgs> {}

export interface IPropertyAstNode extends IAstNode<"Property">, IWithPropertiesAstNodes {
	__list?: boolean;
	__nullable?: boolean;
}

export interface IFieldAstNode<
	TArgs extends object = any,
	TResult = any,
	TContext extends object = any,
	TRequestArgs extends object = any
> extends IAstNode<"Field">, IWithArgsAstNodes, IWithPropertiesAstNodes {
	__fn: IResolverFieldFn<TArgs, TResult, TContext, TRequestArgs>;
	__list?: boolean;
}

export interface IProviderAstNode extends IAstNode<"Provider"> {
	__fields: { [name: string]: IFieldAstNode };
}

interface IAstParams<TRequestArgs extends object = any> {
	parentType: string;
	name: string;
	requestArgs: TRequestArgs;
}

type AstResult<TAst extends IAstNode<any>> = (astParams: IAstParams) => MaybePromise<TAst | null>;

interface IGetTypeNameParams {
	parentType: string;
	name: string;
}

interface IGetTypeInfoParams<T> {
	name: string;
	value: T;
	parentType: string;
}

interface ITypeInfo {
	__type: string;
	__list?: boolean;
	__properties?: { [name: string]: IPropertyAstNode };
}

interface IEvaluateChildNodesParams<
	TChildren extends { [name: string]: AstResult<any> } = any,
	TRequestArgs extends object = any
> {
	parentType: string;
	requestArgs: TRequestArgs;
	children: TChildren;
}

/** ARG START */
interface IArgParams<T> {
	description?: string;
	mock: T;
	nullable?: boolean;
}

interface IResolverFieldFnParams<
	TArgs extends object = any,
	TContext extends object = any,
	TRequestArgs extends object = any
> {
	args: TArgs;
	context: TContext;
	requestArgs: TRequestArgs;
}

type IResolverFieldFn<
	TArgs extends object = any,
	TResult = any,
	TContext extends object = any,
	TRequestArgs extends object = any
> = (fnParams: IResolverFieldFnParams<TArgs, TContext, TRequestArgs>) => MaybePromise<TResult>;

interface IResolverFieldParams<
	TArgs extends object = any,
	TResult = any,
	TContext extends object = any,
	TRequestArgs extends object = any
> {
	description?: string;
	args: { [name in keyof TArgs]: AstResult<IArgAstNode<TArgs[name]>> };
	fn: IResolverFieldFn<TArgs, TResult, TContext, TRequestArgs>;
}

type RequestArgsParams<TRequestArgs extends object = any> = {
	[name in keyof TRequestArgs]: AstResult<IArgAstNode<TRequestArgs[name]>>;
};

interface IProviderObjectTypeParams {
	description?: string;
	fields: Record<string, AstResult<IFieldAstNode>>;
}

interface IMakeClientParams<TRequestArgs extends object = any> {
	requestArgs: AstResult<IRequestArgsAstNode<TRequestArgs>>;
	providers: { [name: string]: AstResult<IProviderAstNode> };
}

export interface IAstRoot {
	query: IRootAstNode;
}

interface IRestQLConfig<TContext extends object = any> {
	baseAst?: Maybe<JSONObject>;
	context: MaybePromise<TContext>;
	outputAst: string;
	outputNexus: string;
	shouldGenerateAst?: boolean;
}

export class RestQL<TContext extends object = any, TRequestArgs extends Record<string, any> = any> {
	private baseAst: Maybe<JSONObject>;
	private context: MaybePromise<TContext>;
	private outputAst: string;
	private outputNexus: string;
	private shouldGenerateAst: boolean;

	constructor(config: IRestQLConfig<TContext>) {
		this.baseAst = config.baseAst;
		this.context = config.context;
		this.outputAst = config.outputAst;
		this.outputNexus = config.outputNexus;
		this.shouldGenerateAst = config.shouldGenerateAst ?? false;
	}

	private evaluateChildNodes = async <TChildren extends { [key: string]: AstResult<any> } = any>(
		params: IEvaluateChildNodesParams<TChildren, TRequestArgs>
	): Promise<EvaledChildAst<TChildren>> => {
		const maybeAsts = await map(
			Object.entries(params.children),
			async ([childName, childResult]) => {
				const childAst = await childResult({
					name: childName,
					parentType: params.parentType,
					requestArgs: params.requestArgs
				});

				return [childName, childAst] as [string, IAstNode<any> | null];
			}
		);

		const children = maybeAsts.reduce(
			(acc, [childName, childAst]) => (!childAst ? acc : { ...acc, [childName]: childAst }),
			{} as EvaledChildAst<TChildren>
		);

		return children;
	};

	private toMockArgs = <TArgs extends object = any>(
		args: { [name in keyof TArgs]: IArgAstNode }
	): TArgs => {
		const mockArgs = Object.entries<IArgAstNode>(args).reduce(
			(acc, [name, argAstNode]) => ({ ...acc, [name]: argAstNode.__mock }),
			{} as TArgs
		);

		return mockArgs;
	};

	private getTypeName = (params: IGetTypeNameParams): string => {
		const type: string = `${upperFirst(params.parentType)}${upperFirst(params.name)}`;

		return type;
	};

	private getTypeInfo = <T = any>(params: IGetTypeInfoParams<T>): ITypeInfo | undefined => {
		const [toTypeCheck = null, list] = Array.isArray(params.value)
			? [head(params.value), true]
			: [params.value, false];

		if (toTypeCheck === null) {
			return undefined;
		}

		switch (typeof toTypeCheck) {
			case "string":
			case "number":
			case "boolean":
				return {
					__type: upperFirst(typeof toTypeCheck),
					__list: list
				};
			case "object": {
				const type: string = this.getTypeName({
					name: params.name,
					parentType: params.parentType
				});

				const properties = Object.entries(toTypeCheck).reduce(
					(acc, [propName, propValue]) => {
						const propTypeInfo = this.getTypeInfo({
							name: propName,
							value: propValue,
							parentType: type
						});

						if (!propTypeInfo) {
							return acc;
						}

						const propertyAst: IPropertyAstNode = {
							...propTypeInfo,
							__kind: "Property"
						};

						return { ...acc, [propName]: propertyAst };
					},
					{} as { [propName: string]: IPropertyAstNode }
				);

				return {
					__type: type,
					__list: list,
					__properties: properties
				};
			}
			default:
				return undefined;
		}
	};

	public arg = <T>(params: IArgParams<T>): AstResult<IArgAstNode<T>> => {
		return ({ parentType, name }) => {
			const typeInfo = this.getTypeInfo({ name, value: params.mock, parentType });

			if (!typeInfo) {
				return null;
			}

			const argAstNode: IArgAstNode = {
				...typeInfo,
				__kind: "Arg",
				__description: params.description,
				__mock: params.mock
			};

			return argAstNode;
		};
	};

	public requestArgsObject = (params: RequestArgsParams): AstResult<IRequestArgsAstNode> => {
		return async ({ name, parentType, requestArgs }) => {
			const args = await this.evaluateChildNodes({
				parentType,
				requestArgs,
				children: params
			});

			const type: string = this.getTypeName({ parentType, name });

			const requestArgsAst: IRequestArgsAstNode = {
				__type: type,
				__kind: "RequestArgs",
				__args: args
			};

			return requestArgsAst;
		};
	};

	public resolverField = <TArgs extends object = any, TResult = any>(
		params: IResolverFieldParams<TArgs, TResult, TContext, TRequestArgs>
	): AstResult<IFieldAstNode> => {
		return async ({ name, parentType, requestArgs }) => {
			if (!this.shouldGenerateAst) {
				const fnAst: IFieldAstNode = {
					__type: "Never",
					__kind: "Field",
					__fn: params.fn
				};

				return fnAst;
			}

			const args = await this.evaluateChildNodes({
				parentType: this.getTypeName({ parentType, name }),
				requestArgs,
				children: params.args
			});

			const mockArgs = this.toMockArgs(args);

			const context = await this.context;

			const mockResult = await params.fn({
				args: mockArgs,
				context,
				requestArgs
			});

			const typeInfo = this.getTypeInfo({
				name,
				parentType,
				value: mockResult
			});

			if (!typeInfo) {
				return null;
			}

			const fieldAst: IFieldAstNode<TArgs, TResult, TContext, TRequestArgs> = {
				...typeInfo,
				__kind: "Field",
				__description: params.description,
				__args: args,
				__fn: params.fn
			};

			return fieldAst;
		};
	};

	public providerObjectType = (
		params: IProviderObjectTypeParams
	): AstResult<IProviderAstNode> => {
		return async ({ name, parentType, requestArgs }) => {
			const typeName: string = this.getTypeName({ name, parentType });

			const fields = await this.evaluateChildNodes({
				parentType: typeName,
				requestArgs,
				children: params.fields
			});

			const type: string = `${typeName}Provider`;

			const providerAst: IProviderAstNode = {
				__type: type,
				__kind: "Provider",
				__description: params.description,
				__fields: fields
			};

			return providerAst;
		};
	};

	public makeClient = (params: IMakeClientParams<TRequestArgs>): RestQLClient => {
		const parentType: string = "";

		const astPromise = (async (): Promise<IAstRoot> => {
			const requestArgs =
				(await params.requestArgs({
					name: "requestArgs",
					parentType,
					requestArgs: {}
				})) ?? ({} as IRequestArgsAstNode<TRequestArgs>);

			const mockRequestArgs = requestArgs.__args
				? this.toMockArgs(requestArgs.__args)
				: ({} as TRequestArgs);

			const providers = await this.evaluateChildNodes({
				parentType,
				children: params.providers,
				requestArgs: mockRequestArgs
			});

			const query: IRootAstNode = {
				__type: "Query",
				__kind: "Root",
				__requestArgs: requestArgs,
				__providers: providers
			};

			const ast: IAstRoot = { query };

			return ast;
		})();

		if (this.shouldGenerateAst) {
			this.writeAst(astPromise);
		}

		const client = new RestQLClient({
			ast: astPromise,
			context: this.context
		});

		return client;
	};

	private updateAst = (ast: IAstRoot): IAstRoot => {
		if (!this.baseAst) {
			return ast;
		}

		const mergedAst: IAstRoot = merge(ast, this.baseAst);

		return mergedAst;
	};

	private writeAst = async (astPromise: MaybePromise<IAstRoot>): Promise<void> => {
		const fs = await import("fs-extra");

		if (!this.outputAst) {
			return;
		}

		const ast: IAstRoot = await astPromise;
		const updatedAst: IAstRoot = this.updateAst(ast);
		const serializedAst: string = JSON.stringify(updatedAst, null, "\t");

		await fs.ensureFile(this.outputAst);

		const code: string = `export default ${serializedAst};
		`;
		await fs.writeFile(this.outputAst, code, {
			encoding: "utf8",
			flag: "w"
		});

		await this.writeNexus(updatedAst);
	};

	private writeNexus = async (ast: IAstRoot): Promise<void> => {
		await generateNexus({
			astPromise: ast,
			output: this.outputNexus
		});
	};
}
