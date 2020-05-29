import { isObject } from "lodash";

/* eslint-disable prettier/prettier */
type DeepNonNullArgs<T> =
	T extends null
		? undefined
		: T extends { [key: string]: any }
			? { [P in keyof T]: DeepNonNullArgs<T[P]> }
			: T extends (infer U)[]
				? DeepNonNullArgs<U>[]
				: T extends readonly (infer U)[]
					? readonly DeepNonNullArgs<U>[]
					: T;
/* eslint-enable prettier/prettier */

export class PrismaUtils {
	public static castInputs = <T>(input: T): DeepNonNullArgs<T> => {
		if (input === null) {
			return undefined as DeepNonNullArgs<T>;
		}

		if (Array.isArray(input)) {
			return input.map((value) => PrismaUtils.castInputs(value)) as DeepNonNullArgs<T>;
		}

		if (isObject(input)) {
			const keys = Object.keys(input) as (keyof T)[];

			return keys.reduce((acc, key) => {
				const value = input[key];

				return { ...acc, [key]: PrismaUtils.castInputs(value) } as DeepNonNullArgs<T>;
			}, {} as DeepNonNullArgs<T>);
		}

		return input as DeepNonNullArgs<T>;
	};
}
