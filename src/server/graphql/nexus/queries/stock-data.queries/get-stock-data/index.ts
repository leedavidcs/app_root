import { DataKeys, Prefixes, PREFIX_PROP_DELIMITER } from "@/server/data-keys";
import { IServerContextWithUser } from "@/server/graphql/context";
import { BadInputError } from "@/server/utils";
import { isEmpty } from "lodash";
import { getIexCompanyData } from "./get-iex-company-data";
import { getIexKeyStatsData } from "./get-iex-key-stats-data";
import { getIexQuoteData } from "./get-iex-quote-data";
import { getIexPreviousDayPriceData } from "./get-iex.previous-day-price-data";

interface IGetStockDataArgs {
	ticker: string;
	dataKeys: readonly string[];
}

export interface IGetStockDataPartialArgs {
	ticker: string;
	suffixes: readonly string[];
}

export type GetStockDataOperation = (
	args: IGetStockDataPartialArgs,
	context: IServerContextWithUser
) => Promise<Record<string, any>>;

const prefixToOperationMap: Record<keyof typeof Prefixes, GetStockDataOperation> = {
	[Prefixes.IEX_COMPANY]: getIexCompanyData,
	[Prefixes.IEX_KEY_STATS]: getIexKeyStatsData,
	[Prefixes.IEX_PREVIOUS_DAY_PRICE]: getIexPreviousDayPriceData,
	[Prefixes.IEX_QUOTE]: getIexQuoteData
};

const assertDataKeysAreValid: (
	dataKeys: readonly string[]
) => asserts dataKeys is readonly (keyof typeof DataKeys)[] = (dataKeys: readonly string[]) => {
	const invalidKeys: readonly string[] = dataKeys.filter((key) => !DataKeys[key]);

	const isValid: boolean = isEmpty(invalidKeys);

	if (!isValid) {
		throw new BadInputError(
			`This operation contains invalid arguments: ${invalidKeys.join(", ")}`
		);
	}
};

const createPrefixedTuple = (dataKey: string): readonly [keyof typeof Prefixes, string] => {
	const [prefix, prop] = dataKey.split(PREFIX_PROP_DELIMITER);

	if (!prefix || !prop) {
		throw new Error(`Invalid data key: ${dataKey}`);
	}

	if (!(prefix in Prefixes)) {
		throw new Error(`Invalid data key: ${dataKey}`);
	}

	return [prefix as keyof typeof Prefixes, prop];
};

const groupDataKeysByPrefix = (
	dataKeys: readonly (keyof typeof DataKeys)[]
): Record<keyof typeof Prefixes, readonly string[]> => {
	const prefixedTuples = dataKeys.map(createPrefixedTuple);

	const groupedByPrefix: Record<keyof typeof Prefixes, readonly string[]> = prefixedTuples.reduce(
		(acc, [prefix, suffix]) => ({
			...acc,
			[prefix]: (acc[prefix] || []).concat(suffix)
		}),
		{} as Record<keyof typeof Prefixes, readonly string[]>
	);

	return groupedByPrefix;
};

export const getStockData = async (
	{ ticker, dataKeys }: IGetStockDataArgs,
	context: IServerContextWithUser
): Promise<Record<string, any>> => {
	assertDataKeysAreValid(dataKeys);

	const groupedKeysByPrefix = groupDataKeysByPrefix(dataKeys);
	const requestPrefixes = Object.keys(groupedKeysByPrefix) as readonly (keyof typeof Prefixes)[];

	const results: readonly Record<string, any>[] = await Promise.all(
		requestPrefixes.map(async (prefix) => {
			const operation = prefixToOperationMap[prefix];
			const suffixes = groupedKeysByPrefix[prefix];

			const result = await operation({ ticker, suffixes }, context);

			return { ...result, ticker };
		})
	);

	const merged: Record<string, any> = results.reduce((acc, data) => ({ ...acc, ...data }));

	return merged;
};
