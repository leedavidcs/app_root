import { PREFIX_PROP_DELIMITER } from "@/server/data-keys";

interface IGetDataWrapperArgs {
	ticker: string;
	suffixes: readonly string[];
}

export const getDataForTicker = async (
	{ ticker, suffixes }: IGetDataWrapperArgs,
	dataFn: Function,
	suffixToPropMap: Record<string, string>,
	prefix: string
): Promise<Record<string, any>> => {
	const result = await dataFn(ticker);

	return suffixes.reduce((acc, key) => {
		const prop: Maybe<string> = suffixToPropMap[key];

		return {
			...acc,
			...(prop && {
				[`${prefix}${PREFIX_PROP_DELIMITER}${key}`]: result[prop]
			})
		};
	}, {});
};
