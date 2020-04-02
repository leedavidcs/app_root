import { dataKeyOptions as generated } from "@/server/generated";
import { queryField, stringArg } from "@nexus/schema";
import { toLower } from "lodash";

const isNoCaseSubStr = (str: string, subStr: string): boolean => {
	return toLower(str).includes(toLower(subStr));
};

export const dataKeyOptions = queryField("dataKeyOptions", {
	type: "DataKeyOption",
	list: true,
	nullable: false,
	description:
		"Retrieves the list of data key options for a stock portfolio header. All filters are \
		OR'ed.",
	args: {
		name: stringArg({ description: "Filter by name (partial works)" }),
		dataKey: stringArg({ description: "Filter by dataKey (partial works)" }),
		provider: stringArg({ description: "Filter by provider (partial works)" })
	},
	resolve: (parent, { name, dataKey, provider }) => {
		const options = generated;

		const filteredOptions = options.filter((option) => {
			const isSubStrName = name ? isNoCaseSubStr(option.name, name) : true;
			const isSubStrDataKey = dataKey ? isNoCaseSubStr(option.dataKey, dataKey) : true;
			const isSubStrProvider = provider ? isNoCaseSubStr(option.provider, provider) : true;

			return isSubStrName || isSubStrDataKey || isSubStrProvider;
		});

		return filteredOptions;
	}
});
