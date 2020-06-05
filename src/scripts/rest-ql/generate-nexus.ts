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
	output: string;
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
		export const ${argNode.__type} = inputObjectType<any>({
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
		export const ${propertyNode.__type} = objectType<any>({
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
	const propNodes = Object.entries(fieldNode.__properties ?? {});

	await mapSeries(propNodes, ([, propNode]) => generatePropertyTypes(propNode, file));

	const code = codeBlock`
		export const ${fieldNode.__type} = objectType<any>({
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
		export const ${providerNode.__type} = objectType<any>({
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
		export const ${requestArgNode.__type} = inputObjectType<any>({
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
		import { arg, inputObjectType, objectType, queryType, scalarType } from "@nexus/schema";
		import { ValueNode } from "graphql";

		/**
		 * @description Assume this value is either a GraphQL Int or Float. Type will not check to
		 * prevent runtime errors, and this type will not differentiate between the two, for
		 * flexability wrt type generation.
		 */
		export const Number = scalarType({
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

	const file: WriteStream = fs.createWriteStream(config.output, {
		encoding: "utf8",
		flags: "w"
	});

	await generateBaseCode(file);

	await generateRequestArgTypes(requestArgNode, file);

	await mapSeries(providerNodes, ([providerName, providerNode]) => {
		return generateProviderTypes(providerNode, providerName, file);
	});

	const code = codeBlock`
		export const Providers = objectType<any>({
			name: "Providers",
			definition: (t) => {
				${providerNodes.map(
					([providerName, providerNode]) => codeBlock`
						t.field("${providerName}", {
							type: "${providerNode.__type}" as any,
							nullable: false,
							description: "${providerNode.__description ?? ""}",
							resolve: ({ requestArgs }) => ({ requestArgs })
						});
					`
				)}
			}
		});

		export const Query = queryType({
			description: "Root query type",
			definition: (t) => {
				t.boolean("ok", { resolve: () => true });
				t.field("providers", {
					type: "Providers" as any,
					args: {
						requestArgs: arg({
							type: "${requestArgNode.__type}" as any,
							nullable: false,
							description: "${requestArgNode.__description ?? ""}"
						})
					},
					resolve: (parent, { requestArgs }) => ({ requestArgs })
				});
			}
		});
	`;

	await writeToFile(code, file);

	return code;
};
