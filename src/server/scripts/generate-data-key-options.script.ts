import { IexCloudAPI } from "@/server/datasources";
import { Logger } from "@/server/utils";
import fs from "fs-extra";
import { camelCase, isArray, isPlainObject, toLower, trim, uniqBy } from "lodash";
import path from "path";

const writePath: string = path.join(
	process.env.PROJECT_DIRNAME || "",
	"./src/server/generated/data-key-options.generated.ts"
);

const iexCloudApi = new IexCloudAPI();

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

const getDataKeyOptions = async () => {
	const ticker = "GOOGL";

	const results = await iexCloudApi.symbols(
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

	return options;
};

const main = async () => {
	const dataKeyOptions = await getDataKeyOptions();
	const sorted = dataKeyOptions.sort((a, b) => a.dataKey.localeCompare(b.dataKey));

	const contents = `
	export const dataKeyOptions: { name: string; dataKey: string; provider: "IEX_CLOUD" }[] =
	${JSON.stringify(sorted, null, 2)}
	`;

	fs.ensureFileSync(writePath);
	fs.writeFileSync(writePath, contents, {
		encoding: "utf8",
		flag: "w"
	});

	Logger.info("DataKey options have been built.");
};

main().then(() => process.exit(0));
