import { IServerContextWithUser } from "@/server/graphql";
import Alpaca from "@alpacahq/alpaca-trade-api";
import { DataSource } from "apollo-datasource";
import { immediate } from "blend-promise-utils";
import { set, startOfToday, subDays } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { upperCase } from "lodash";
import ms from "ms";
import PQueue from "p-queue";

const alpacaApiKey: string = process.env.ALPACA_API_KEY ?? "";
const alpacaSecretKey: string = process.env.ALPACA_SECRET_KEY ?? "";

/**
 * @description Alpaca has a rate limit of 200 requests / 1m. We are requesting half that rate for
 *     safety.
 * @see (@link https://alpaca.markets/docs/api-documentation/api-v2/#rate-limit)
 * @author David Lee
 * @date May 18, 2020
 */
const queue = new PQueue({
	concurrency: 100,
	interval: ms("1m"),
	intervalCap: 100
});

export class AlpacaAPI extends DataSource<IServerContextWithUser> {
	private alpaca = new Alpaca({
		keyId: alpacaApiKey,
		secretKey: alpacaSecretKey,
		paper: true,
		usePolygon: false
	});

	private withTransformedArgs<TParams extends any[], TResult extends any>(
		fn: (...params: TParams) => MaybePromise<TResult>,
		transform: (...params: TParams) => any[] = (...params: TParams) => params
	) {
		return (...params: TParams) => fn(...(transform(...params) as any));
	}

	private withRateLimit<TParams extends any[], TResult, TTransform = TResult>(
		fn: (...params: TParams) => Promise<TResult>,
		transform: (result: TResult) => MaybePromise<TTransform> = immediate
	) {
		return (...params: TParams) =>
			queue.add(() =>
				fn
					.call(this.alpaca, ...params)
					.then((result) => {
						return transform(result);
					})
					.catch(() => null)
			);
	}

	public getClock = this.withRateLimit(
		this.alpaca.getClock,
		({ timestamp, is_open, next_open, next_close }) => ({
			timestamp: new Date(timestamp),
			is_open,
			next_open: new Date(next_open),
			next_close: new Date(next_close)
		})
	);

	public lastQuote = this.withTransformedArgs(
		this.withRateLimit(
			this.alpaca.lastQuote,
			({ status, symbol, last: { timestamp, ...restLast } }) => ({
				status,
				symbol,
				last: {
					timestamp: new Date(timestamp),
					...restLast
				}
			})
		),
		(symbol) => [upperCase(symbol)]
	);

	public lastTrade = this.withTransformedArgs(
		this.withRateLimit(
			this.alpaca.lastTrade,
			({ status, symbol, last: { timestamp, ...restLast } }) => ({
				status,
				symbol,
				last: {
					timestamp: new Date(timestamp),
					...restLast
				}
			})
		),
		(symbol) => [upperCase(symbol)]
	);

	public get todayRegularTradingHours(): [Date, Date] {
		const today: Date = startOfToday();

		const utc0930: Date = set(today, {
			hours: 9,
			minutes: 30
		});

		const utc1600: Date = set(today, {
			hours: 16,
			minutes: 0
		});

		const et0930: Date = utcToZonedTime(utc0930, "America/New_York");
		const et1600: Date = utcToZonedTime(utc1600, "America/New_York");

		return [et0930, et1600];
	}

	/**
	 * @description Today [09:28ET, 19:00ET] - This is when executable OPG orders should be
	 *     executed (Orders created in `this.executableOpgOrderTimeRange`)
	 */
	public get todayOpgRejectTimeRange(): [Date, Date] {
		const today: Date = startOfToday();

		const utc0928: Date = set(today, {
			hours: 9,
			minutes: 28,
			seconds: 0
		});

		const utc1900: Date = set(today, {
			hours: 19,
			minutes: 0
		});

		const et0928: Date = utcToZonedTime(utc0928, "America/New_York");
		const et1900: Date = utcToZonedTime(utc1900, "America/New_York");

		return [et0928, et1900];
	}

	/**
	 * @description Today [15:50ET, 19:00ET] - This is when executable OPG orders should be
	 *     executed (Orders created in `this.executableClsOrderTimeRange`)
	 */
	public get todayClsRejectTimeRange(): [Date, Date] {
		const today: Date = startOfToday();

		const utc1550: Date = set(today, {
			hours: 15,
			minutes: 50
		});

		const utc1900: Date = set(today, {
			hours: 19,
			minutes: 0
		});

		const et1550: Date = utcToZonedTime(utc1550, "America/New_York");
		const et1900: Date = utcToZonedTime(utc1900, "America/New_York");

		return [et1550, et1900];
	}

	/**
	 * @description [Yesterday 19:00ET, Today 09:28ET] - Orders created in this time  should be
	 *     executed during the time range given by `this.todayOpgRejectTimeRange`
	 */
	public get executableOpgOrderTimeRange(): [Date, Date] {
		const [start, end] = this.todayOpgRejectTimeRange;

		return [subDays(end, 1), start];
	}

	/**
	 * @description [Yesterday 19:00ET, Today 15:50ET] - Orders created in this time should be
	 *     executed during the time range given by `this.todayClsRejectTimeRange`;
	 */
	public get executableClsOrderTimeRange(): [Date, Date] {
		const [start, end] = this.todayClsRejectTimeRange;

		return [subDays(end, 1), start];
	}

	/**
	 * @description [2-days-ago 19:00ET, Yesterday 09:28] - Orders created in this time, with a
	 *     status = OrderStatus.Open, should be considered expired. Execute during
	 *     `this.todayOpgRejectTimeRange`
	 */
	public get expiredOpgOrderTimeRange(): [Date, Date] {
		const [start, end] = this.executableOpgOrderTimeRange;

		return [subDays(start, 1), subDays(end, 1)];
	}

	/**
	 * @description [2-days-ago 19:00ET, Yesterday 15:50] - Orders created in this time, with a
	 *     status = OrderStatus.Open, should be considered expired. Execute during
	 *     `this.todayClsRejectTimeRange`
	 */
	public get expiredClsOrderTimeRange(): [Date, Date] {
		const [start, end] = this.executableClsOrderTimeRange;

		return [subDays(start, 1), subDays(end, 1)];
	}
}
