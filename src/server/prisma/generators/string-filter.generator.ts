import { StringFilter } from "@prisma/client";
import { isNil, lowerCase, upperCase, upperFirst } from "lodash";

export const stringFilter = (
	name: string,
	value?: Maybe<string>
): readonly Record<string, StringFilter>[] => {
	if (isNil(value)) {
		return [];
	}

	return [
		{ [name]: { contains: value } },
		{ [name]: { contains: lowerCase(value) } },
		{ [name]: { contains: upperCase(value) } },
		{ [name]: { contains: upperFirst(value) } },
		{
			[name]: {
				contains: value
					.split(" ")
					.map(lowerCase)
					.join(" ")
			}
		},
		{
			[name]: {
				contains: value
					.split(" ")
					.map(upperCase)
					.join(" ")
			}
		},
		{
			[name]: {
				contains: value
					.split(" ")
					.map(upperFirst)
					.join(" ")
			}
		}
	];
};
