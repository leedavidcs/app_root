export * from "./string-filter.generator";

export const applyGenerators = (
	whereInput: Maybe<Record<string, any>>,
	generators: readonly (readonly Record<string, any>[])[]
) => ({
	...whereInput,
	AND: [
		...(whereInput?.AND || []),
		{
			OR: [
				...(whereInput?.AND?.OR || []),
				...generators.reduce((acc, generator) => acc.concat(generator))
			]
		}
	]
});
