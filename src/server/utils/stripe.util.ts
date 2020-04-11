const CONVERSION_FROM_ZERO_DECIMAL_CURRENCY = 100;

export class StripeUtil {
	public static formatAmount(amount: number, currency: string): number {
		const numberFormat = new Intl.NumberFormat(["en-US"], {
			style: "currency",
			currency,
			currencyDisplay: "symbol"
		});

		const parts = numberFormat.formatToParts(amount);

		const isZeroDecimalCurrency: boolean = parts.every(({ type }) => type !== "decimal");

		return isZeroDecimalCurrency
			? amount
			: Math.round(amount * CONVERSION_FROM_ZERO_DECIMAL_CURRENCY);
	}
}
