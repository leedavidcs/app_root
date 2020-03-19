import {
	IexPreviousDayPriceDataKeys,
	IexPreviousDayPriceSuffixToPropMap,
	PREFIX_PROP_DELIMITER
} from "@/server/data-keys";

export const IexPreviousDayPriceDataKeyOptions = Object.keys(IexPreviousDayPriceDataKeys).reduce(
	(acc, dataKey) => {
		const [, suffix] = dataKey.split(PREFIX_PROP_DELIMITER);
		const prop: string = IexPreviousDayPriceSuffixToPropMap[suffix];

		return acc.concat({
			name: `iex.previousDayPrice.${prop}`,
			dataKey,
			description:
				`Property (${prop}) in Previous Day Price. (see: ` +
				"https://iexcloud.io/docs/api/#previous-day-price)",
			provider: "IEX_CLOUD"
		});
	},
	[] as any[]
);
