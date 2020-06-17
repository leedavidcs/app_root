import { mapSeries } from "blend-promise-utils";
import { codeBlock } from "common-tags";
import fs, { WriteStream } from "fs-extra";
import prettier from "prettier";
import type {
	IArgAstNode,
	IAstRoot,
	IFieldAstNode,
	IPropertyAstNode,
	IProviderAstNode,
	IRequestArgsAstNode
} from ".";

interface IGenerateNexusOptions {
	astPromise: MaybePromise<IAstRoot>;
	outputNexus: string;
	outputGraphQL: string;
}

const writeToFile = (code: string, file: WriteStream): Promise<void> => {
	return new Promise<void>((resolve) => {
		const formatted = prettier.format(code, {
			parser: "typescript",
			printWidth: 100,
			tabWidth: 4,
			trailingComma: "none",
			useTabs: true
		});

		const didWrite: boolean = file.write(`${formatted}\n`);

		if (didWrite) {
			return resolve();
		}

		file.once("drain", () => writeToFile(code, file).then(() => resolve()));
	});
};

const generateArgTypes = async (
	argNode: IArgAstNode | IPropertyAstNode,
	file: WriteStream
): Promise<string> => {
	switch (argNode.__type) {
		case "Number":
		case "String":
		case "Boolean":
			return "";
		default:
	}

	const propNodes = Object.entries(argNode.__properties ?? {});

	await mapSeries(propNodes, ([, propNode]) => generateArgTypes(propNode, file));

	const code = codeBlock`
		types.${argNode.__type} = inputObjectType<any>({
			name: "${argNode.__type}",
			description: "${argNode.__description ?? ""}",
			definition: (t) => {
				${propNodes.map(
					([propName, propNode]) => codeBlock`
						t${propNode.__list && ".list"}.field("${propName}", {
							type: "${propNode.__type}" as any,
							nullable: ${Boolean(propNode.__nullable ?? true).toString()}
						});
					`
				)}
			}
		});
	`;

	await writeToFile(code, file);

	return code;
};

const generatePropertyTypes = async (
	propertyNode: IPropertyAstNode,
	file: WriteStream
): Promise<string> => {
	switch (propertyNode.__type) {
		case "Number":
		case "String":
		case "Boolean":
			return "";
		default:
	}

	const propNodes = Object.entries(propertyNode.__properties ?? {});

	await mapSeries(propNodes, ([, propNode]) => generatePropertyTypes(propNode, file));

	const code = codeBlock`
		types.${propertyNode.__type} = objectType<any>({
			name: "${propertyNode.__type}",
			description: "${propertyNode.__description ?? ""}",
			definition: (t) => {
				${propNodes.map(
					([propName, propNode]) => codeBlock`
						t${propNode.__list && ".list"}.field("${propName}", {
							type: "${propNode.__type}" as any,
							nullable: ${Boolean(propNode.__nullable ?? true).toString()}
						});
					`
				)}
			}
		});
	`;

	await writeToFile(code, file);

	return code;
};

const generateResolverFieldTypes = async (
	fieldNode: IFieldAstNode,
	file: WriteStream
): Promise<string> => {
	switch (fieldNode.__type) {
		case "Number":
		case "String":
		case "Boolean":
			return "";
		default:
	}

	const propNodes = Object.entries(fieldNode.__properties ?? {});

	await mapSeries(propNodes, ([, propNode]) => generatePropertyTypes(propNode, file));

	const code = codeBlock`
		types.${fieldNode.__type} = objectType<any>({
			name: "${fieldNode.__type}",
			description: "${fieldNode.__description ?? ""}",
			definition: (t) => {
				${propNodes.map(
					([propName, propNode]) => codeBlock`
						t${propNode.__list && ".list"}.field("${propName}", {
							type: "${propNode.__type}" as any,
							nullable: ${Boolean(propNode.__nullable ?? true).toString()}
						});
					`
				)}
			}
		});
	`;

	await writeToFile(code, file);

	return code;
};

const generateProviderTypes = async (
	providerNode: IProviderAstNode,
	parentName: string,
	file: WriteStream
): Promise<string> => {
	const fieldNodes = Object.entries(providerNode.__fields);

	await mapSeries(fieldNodes, ([, fieldNode]) => generateResolverFieldTypes(fieldNode, file));

	const code = codeBlock`
		types.${providerNode.__type} = objectType<any>({
			name: "${providerNode.__type}",
			description: "${providerNode.__description ?? ""}",
			definition: (t) => {
				${fieldNodes.map(
					([fieldName, fieldNode]) => codeBlock`
						t${fieldNode.__list && ".list"}.field("${fieldName}", {
							type: "${fieldNode.__type}" as any,
							nullable: true,
							description: "${fieldNode.__description ?? ""}",
							resolve: async (parent, args = {}, context) => {
								const result = await (context as any).client.query({
									provider: "${parentName}",
									requestArgs: (parent as any).requestArgs,
									groupByArgs: (parent as any).groupByArgs,
									fields: {
										${fieldName}: { args }
									}
								});

								return result.${fieldName};
							}
						});
					`
				)}
			}
		});
	`;

	await writeToFile(code, file);

	return code;
};

const generateRequestArgTypes = async (
	requestArgNode: IRequestArgsAstNode,
	file: WriteStream
): Promise<string> => {
	const argNodes = Object.entries(requestArgNode.__args ?? {});

	await mapSeries(argNodes, ([, argNode]) => generateArgTypes(argNode, file));

	const code = codeBlock`
		types.${requestArgNode.__type} = inputObjectType<any>({
			name: "${requestArgNode.__type}",
			description: "${requestArgNode.__description ?? ""}",
			definition: (t) => {
				${argNodes.map(
					([argName, argNode]) => codeBlock`
						t${argNode.__list && ".list"}.field("${argName}", {
							type: "${argNode.__type}" as any,
							nullable: ${Boolean(argNode.__nullable ?? true).toString()}
						});
					`
				)}
			}
		});
	`;

	await writeToFile(code, file);

	return code;
};

const generateBaseCode = async (file: WriteStream): Promise<string> => {
	const code = codeBlock`
		import {
			arg,
			inputObjectType,
			makeSchema,
			objectType,
			queryType,
			scalarType
		} from "@nexus/schema";
		import { ValueNode } from "graphql";
		import path from "path";

		const dirname: string = path.join(
			process.env.PROJECT_DIRNAME ?? "",
			"src/scripts/generated"
		);

		const getPath = (fileName: string): string => path.join(dirname, fileName);

		const types = {} as Record<string, any>;

		/**
		 * @description Assume this value is either a GraphQL Int or Float. Type will not check to
		 * prevent runtime errors, and this type will not differentiate between the two, for
		 * flexability wrt type generation.
		 */
		types.Number = scalarType({
			name: "Number",
			serialize: (value: number) => value,
			parseValue: (value: number) => value,
			parseLiteral: (ast: ValueNode) => (ast as any).value ?? undefined
		});
	`;

	await writeToFile(code, file);

	return code;
};

export const generateNexus = async (config: IGenerateNexusOptions): Promise<string> => {
	const { astPromise } = config;

	const { query }: IAstRoot = (await astPromise) as any;

	const requestArgNode = query.__requestArgs;
	const providerNodes = Object.entries(query.__providers);

	const file: WriteStream = fs.createWriteStream(config.outputNexus, {
		encoding: "utf8",
		flags: "w"
	});

	await generateBaseCode(file);

	await generateRequestArgTypes(requestArgNode, file);

	await mapSeries(providerNodes, ([providerName, providerNode]) => {
		return generateProviderTypes(providerNode, providerName, file);
	});

	const requestArgGroups = Object.entries(requestArgNode.__groupBy ?? {}).filter(([argName]) => {
		return Boolean(requestArgNode.__args?.[argName]);
	});
	const doesGroupBy: boolean = requestArgGroups.length !== 0;

	const code = codeBlock`
		types.Providers = objectType<any>({
			name: "Providers",
			definition: (t) => {
				${providerNodes.map(
					([providerName, providerNode]) => codeBlock`
						t.field("${providerName}", {
							type: "${providerNode.__type}" as any,
							nullable: false,
							description: "${providerNode.__description ?? ""}",
							resolve: ({ requestArgs, groupByArgs }) => ({
								requestArgs,
								groupByArgs
							})
						});
					`
				)}
			}
		});

		types.Data = objectType<any>({
			name: "Data",
			definition: (t) => {
				${requestArgGroups.map(([argName, argGroupByAlias]) => {
					const argNode = requestArgNode.__args?.[argName];

					if (!argNode) {
						return "";
					}

					return codeBlock`
						t.field("${argGroupByAlias}", {
							type: "${argNode.__type}",
							nullable: false,
							resolve: ({ groupByArgs }) => (groupByArgs as any)?.${argGroupByAlias}
						});
					`;
				})}
				t.field("providers", {
					type: "Providers" as any,
					nullable: false,
					resolve: ({ requestArgs, groupByArgs }) => ({
						requestArgs,
						groupByArgs
					})
				});
			}
		});

		types.Query = queryType({
			description: "Root query type",
			definition: (t) => {
				t.boolean("ok", { resolve: () => true });
				t${doesGroupBy && ".list"}.field("data", {
					type: "Data" as any,
					nullable: false,
					args: {
						requestArgs: arg({
							type: "${requestArgNode.__type}" as any,
							nullable: false,
							description: "${requestArgNode.__description ?? ""}"	
						})
					},
					resolve: (parent, { requestArgs }) => {${((): string => {
						if (!doesGroupBy) {
							return codeBlock`
								return { requestArgs };
							`;
						}

						const groupKeys = requestArgGroups.map(([argName]) => argName).join(", ");

						return codeBlock`
							const { ${groupKeys} } = requestArgs;
							const groupByArgsPairs = [${requestArgGroups.map(([name, alias]) => {
								return codeBlock`["${name}", "${alias}"]`;
							})}];

							const cartesian = <T = any>(...arrays: T[][]): T[][] => {
								return arrays.reduce<T[][]>(
									(results, entries) =>
										results
											.map((res) => entries.map((entry) => [...res, entry]))
											.reduce((sub, res) => [...sub, ...res], []),
									[[]]
								);
							};

							const withGroups = cartesian(${groupKeys}).map((product) => {
								const groupByArgs =  product.reduce((acc, value, i) => {
									const alias = groupByArgsPairs[i][1];

									return { ...acc, [alias]: value };
								}, {} as Record<string, any>);

								return { groupByArgs, requestArgs };
							});

							return withGroups;
						`;
					})()}}
				});
			}
		});

		export const schema = makeSchema({
			nonNullDefaults: {
				input: false,
				output: false
			},
			outputs: {
				schema: getPath("${config.outputGraphQL}")
			},
			shouldGenerateArtifacts: true,
			shouldExitAfterGenerateArtifacts: false,
			types
		});
	`;

	await writeToFile(code, file);

	return code;
};
