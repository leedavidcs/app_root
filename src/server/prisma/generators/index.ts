import { isEmpty } from "lodash-es";
export * from "./string-filter.generator";

export const applyGenerators = (
	whereInput: Maybe<Record<string, any>>,
	generators: readonly (readonly Record<string, any>[])[]
) => {
	const filters = generators.reduce((acc, generator) => acc.concat(generator));

	return {
		...whereInput,
		AND: [...(whereInput?.AND || []), ...(isEmpty(filters) ? [] : [{ OR: filters }])]
	};
};
