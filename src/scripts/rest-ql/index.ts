import { map } from "blend-promise-utils";
import { head, isEmpty, merge, upperFirst } from "lodash";
import path from "path";
import { RestQLClient } from "./client";
import { generateNexus } from "./generate-nexus";

const dirname: string = path.join(process.env.PROJECT_DIRNAME ?? "", "src/scripts/generated");

const getPath = (fileName: string) => path.join(dirname, fileName);

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
		IWithArgsAstNodes<TRequestArgs> {
	__groupBy?: { [key in keyof TRequestArgs]: string };
}

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

interface IAstParams<TRequestArgs extends object = any, TGroupByArgs extends object = any> {
	makeClientConfig: IMakeClientConfig;
	parentType: string;
	name: string;
	requestArgs: TRequestArgs;
	groupByArgs: TGroupByArgs;
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
	TRequestArgs extends object = any,
	TGroupByArgs extends object = any
> {
	makeClientConfig: IMakeClientConfig;
	parentType: string;
	requestArgs: TRequestArgs;
	groupByArgs: TGroupByArgs;
	children: TChildren;
}

interface IArgParams<T> {
	description?: string;
	mock: T;
	nullable?: boolean;
}

interface IResolverFieldFnParams<
	TArgs extends object = any,
	TContext extends object = any,
	TRequestArgs extends object = any,
	TGroupByArgs extends object = any
> {
	args: TArgs;
	context: TContext;
	requestArgs: TRequestArgs;
	groupByArgs: TGroupByArgs;
	isMock: boolean;
}

type IResolverFieldFn<
	TArgs extends object = any,
	TResult = any,
	TContext extends object = any,
	TRequestArgs extends object = any,
	TGroupByArgs extends object = any
> = (
	fnParams: IResolverFieldFnParams<TArgs, TContext, TRequestArgs, TGroupByArgs>
) => MaybePromise<TResult>;

interface IResolverFieldParams<
	TArgs extends object = any,
	TResult = any,
	TContext extends object = any,
	TRequestArgs extends object = any,
	TGroupByArgs extends object = any
> {
	description?: string;
	args?: { [name in keyof TArgs]: AstResult<IArgAstNode<TArgs[name]>> };
	fn: IResolverFieldFn<TArgs, TResult, TContext, TRequestArgs, TGroupByArgs>;
}

type RequestArgsParams<TRequestArgs extends object = any> = {
	args: {
		[name in keyof TRequestArgs]: AstResult<IArgAstNode<TRequestArgs[name]>>;
	};
	groupBy?: { [name in keyof TRequestArgs]: string };
};

interface IProviderObjectTypeParams {
	description?: string;
	fields: Record<string, AstResult<IFieldAstNode>>;
}

interface IMakeClientOutput {
	ast: string;
	graphQL: string;
	nexus: string;
}

interface IMakeClientConfig {
	baseAst?: Maybe<JSONObject>;
	output: IMakeClientOutput;
	shouldGenerateArtifacts?: boolean;
}

interface IMakeClientParams<TRequestArgs extends object = any> {
	config: IMakeClientConfig;
	requestArgs: AstResult<IRequestArgsAstNode<TRequestArgs>>;
	providers: { [name: string]: AstResult<IProviderAstNode> };
}

export interface IAstRoot {
	query: IRootAstNode;
}

interface IRestQLConfig<TContext extends object = any> {
	context: MaybePromise<TContext>;
}

export class RestQL<
	TContext extends object = any,
	TRequestArgs extends object = any,
	TGroupByArgs extends object = any
> {
	private context: MaybePromise<TContext>;

	constructor(config: IRestQLConfig<TContext>) {
		this.context = config.context;
	}

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
		return async ({ makeClientConfig, name, parentType, requestArgs, groupByArgs }) => {
			const args = await this.evaluateChildNodes({
				makeClientConfig,
				parentType,
				requestArgs,
				groupByArgs,
				children: params.args
			});

			const type: string = this.getTypeName({ parentType, name });

			const requestArgsAst: IRequestArgsAstNode = {
				__type: type,
				__kind: "RequestArgs",
				__args: args,
				__groupBy: params.groupBy
			};

			return requestArgsAst;
		};
	};

	public resolverField = <TArgs extends object = any, TResult = any>(
		params: IResolverFieldParams<TArgs, TResult, TContext, TRequestArgs, TGroupByArgs>
	): AstResult<IFieldAstNode> => {
		return async ({ makeClientConfig, name, parentType, requestArgs, groupByArgs }) => {
			if (!makeClientConfig.shouldGenerateArtifacts) {
				const fnAst: IFieldAstNode = {
					__type: "Never",
					__kind: "Field",
					__fn: params.fn
				};

				return fnAst;
			}

			const args = await this.evaluateChildNodes({
				makeClientConfig,
				parentType: this.getTypeName({ parentType, name }),
				requestArgs,
				groupByArgs,
				children: params.args ?? {}
			});

			const mockArgs = this.toMockArgs(args);

			const context = await this.context;

			const mockResult = await params.fn({
				args: mockArgs,
				context,
				requestArgs,
				groupByArgs,
				isMock: true
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
		return async ({ makeClientConfig, name, parentType, requestArgs, groupByArgs }) => {
			const typeName: string = this.getTypeName({ name, parentType });

			const fields = await this.evaluateChildNodes({
				makeClientConfig,
				parentType: typeName,
				requestArgs,
				groupByArgs,
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
		const makeClientConfig = params.config;

		const parentType: string = "";

		const astPromise = (async (): Promise<IAstRoot> => {
			const requestArgs =
				(await params.requestArgs({
					makeClientConfig,
					name: "requestArgs",
					parentType,
					requestArgs: {},
					groupByArgs: {}
				})) ?? ({} as IRequestArgsAstNode<TRequestArgs>);

			const mockRequestArgs = requestArgs.__args
				? this.toMockArgs(requestArgs.__args)
				: ({} as TRequestArgs);

			const mockGroupByArgs = this.toMockGroupByArgs(
				mockRequestArgs,
				requestArgs.__groupBy ?? {}
			);

			const providers = await this.evaluateChildNodes({
				makeClientConfig,
				parentType,
				children: params.providers,
				requestArgs: mockRequestArgs,
				groupByArgs: mockGroupByArgs
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

		if (makeClientConfig.shouldGenerateArtifacts) {
			this.writeAst(astPromise, makeClientConfig);
		}

		const client = new RestQLClient({
			ast: astPromise,
			context: this.context
		});

		return client;
	};

	private evaluateChildNodes = async <TChildren extends { [key: string]: AstResult<any> } = any>(
		params: IEvaluateChildNodesParams<TChildren, TRequestArgs>
	): Promise<EvaledChildAst<TChildren>> => {
		const maybeAsts = await map(
			Object.entries(params.children),
			async ([childName, childResult]) => {
				const childAst = await childResult({
					makeClientConfig: params.makeClientConfig,
					name: childName,
					parentType: params.parentType,
					requestArgs: params.requestArgs,
					groupByArgs: params.groupByArgs
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

	private toMockGroupByArgs = (
		mockRequestArgs: TRequestArgs,
		groupBy: Partial<Record<keyof TRequestArgs, string>>
	): TGroupByArgs => {
		const groupByTuples = Object.entries(groupBy) as [string, string][];

		const mockGroupByArgs = groupByTuples.reduce((acc, [name, alias]) => {
			const mockRequestArg = mockRequestArgs[name];

			if (!Array.isArray(mockRequestArg) || mockRequestArg.length === 0) {
				throw new Error("RequestArg to be grouped must be a non-empty array");
			}

			return { ...acc, [alias]: mockRequestArg[0] ?? null };
		}, {} as TGroupByArgs);

		return mockGroupByArgs;
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

				if (isEmpty(properties)) {
					return undefined;
				}

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

	private updateAst = (ast: IAstRoot, makeClientConfig: IMakeClientConfig): IAstRoot => {
		if (!makeClientConfig.baseAst) {
			return ast;
		}

		const mergedAst: IAstRoot = merge(ast, makeClientConfig.baseAst);

		return mergedAst;
	};

	private writeAst = async (
		astPromise: MaybePromise<IAstRoot>,
		makeClientConfig: IMakeClientConfig
	): Promise<void> => {
		const fs = await import("fs-extra");

		if (!makeClientConfig.output.ast) {
			return;
		}

		const astFileName: string = getPath(makeClientConfig.output.ast);

		const ast: IAstRoot = await astPromise;
		const updatedAst: IAstRoot = this.updateAst(ast, makeClientConfig);
		const serializedAst: string = JSON.stringify(updatedAst, null, "\t");

		await fs.ensureFile(astFileName);

		const code: string = `export default ${serializedAst};
		`;

		await fs.writeFile(astFileName, code, {
			encoding: "utf8",
			flag: "w"
		});

		await this.writeNexus(updatedAst, makeClientConfig);
	};

	private writeNexus = async (
		ast: IAstRoot,
		makeClientConfig: IMakeClientConfig
	): Promise<void> => {
		await generateNexus({
			astPromise: ast,
			outputGraphQL: makeClientConfig.output.graphQL,
			outputNexus: getPath(makeClientConfig.output.nexus)
		});
	};
}
