/**
 * @description Transforms an array of same-parameter functions, into a function that accepts the
 *     same parameters and returns a Promise when all functions are done running concurrently.
 * @author David Lee
 * @date January 16, 2020
 */
export const makeConcurrentFunc = <Args extends readonly any[]>(
	funcs: readonly ((...args: Args) => void)[]
): ((...args: Args) => Promise<void>) => (...args: Args) =>
	Promise.all<void>(funcs.map((func) => Promise.resolve(func(...args)))).then(undefined);
