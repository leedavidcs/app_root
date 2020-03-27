import { camelCase, isArray, isPlainObject, toLower, trim, uniqBy } from "lodash";
import { queryField, stringArg } from "nexus";

/**
 * @description From an API result, will output a list of keys that are intended to query on a
 * nested data result.
 */
const getFlattenedKeys = (obj: any): readonly string[] => {
	if (!isPlainObject(obj)) {
		return [];
	}

	return Object.keys(obj)
		.map((key) => {
			const nested = obj[key];

			if (
				typeof nested === "string" ||
				typeof nested === "number" ||
				typeof nested === "boolean"
			) {
				return [key];
			}

			if (isPlainObject(nested)) {
				return getFlattenedKeys(nested).map((nestedKey) => `${key}.${nestedKey}`);
			}

			/** Create key values on arrays, only if the array contains 1 element */
			if (isArray(nested) && nested.length === 1) {
				const nestedItem = nested[0];

				return getFlattenedKeys(nestedItem).map((nestedKey) => `${key}[0].${nestedKey}`);
			}

			/** Ignore all other results */
			return [];
		})
		.filter((keys) => {
			return keys.length > 0;
		})
		.reduce((acc, keys) => [...acc, ...keys], [])
		.map((key) => trim(key, "."));
};

const isNoCaseSubStr = (str: string, subStr: string): boolean => {
	return toLower(str).includes(toLower(subStr));
};

/**
 * @description Cleans up a data-key to a cleaner, client-intended label.
 *    transforms: "balance-sheet.balancesheet.reportDate" to "balanceSheet.reportDate"
 * @author David Lee
 * @date March 27, 2020
 */
const sanitizeLabel = (dataKey: string): string => {
	return uniqBy(
		dataKey.split(".").map((partial) => camelCase(partial.replace(/\[\d+\]/g, ""))),
		toLower
	).join(".");
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
	resolve: async (parent, { name, dataKey, provider }, { dataSources }) => {
		const { IexCloudAPI } = dataSources;

		const ticker = "GOOGL";

		const results = await IexCloudAPI.symbols(
			[ticker],
			{
				balanceSheet: true,
				book: true,
				cashFlow: true,
				ceoCompensation: true,
				chart: false,
				company: true,
				delayedQuote: false,
				dividends: false,
				earnings: true,
				estimates: true,
				financials: true,
				fundOwnership: false,
				income: true,
				insiderRoster: false,
				insiderSummary: false,
				insiderTransactions: false,
				institutionalOwnership: false,
				intradayPrices: true,
				largestTrades: true,
				logo: true,
				news: true,
				options: true,
				peers: true,
				previous: true,
				price: true,
				priceTarget: true,
				ohlc: true,
				quote: true,
				recommendationTrends: true,
				sentiment: true,
				shortInterest: false,
				stats: true,
				volumeByVenue: true
			},
			{ mock: true }
		);

		if (!results[ticker]) {
			return [];
		}

		const iexKeys: readonly string[] = getFlattenedKeys(results[ticker]);

		const options = iexKeys.map<{ name: string; dataKey: string; provider: "IEX_CLOUD" }>(
			(iexKey) => ({
				name: sanitizeLabel(iexKey),
				dataKey: iexKey,
				provider: "IEX_CLOUD"
			})
		);

		const filteredOptions = options.filter((option) => {
			const isSubStrName = name ? isNoCaseSubStr(option.name, name) : true;
			const isSubStrDataKey = dataKey ? isNoCaseSubStr(option.dataKey, dataKey) : true;
			const isSubStrProvider = provider ? isNoCaseSubStr(option.provider, provider) : true;

			return isSubStrName || isSubStrDataKey || isSubStrProvider;
		});

		return filteredOptions;
	}
});
