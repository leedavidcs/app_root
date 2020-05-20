import { IServerContextWithUser } from "@/server/graphql";
import Alpaca from "@alpacahq/alpaca-trade-api";
import { DataSource } from "apollo-datasource";
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

	private withRateLimit<TParams extends any[], TResult, TTransform = TResult>(
		fn: (...params: TParams) => Promise<TResult>,
		transform?: (result: TResult) => MaybePromise<TTransform>
	) {
		return (...params: TParams) =>
			queue.add(() =>
				fn.call(this.alpaca, ...params).then((result) => {
					return transform ? transform(result) : result;
				})
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

	public lastQuote = this.withRateLimit(this.alpaca.lastQuote, ({ timestamp, ...restProps }) => ({
		timestamp: new Date(timestamp),
		...restProps
	}));
}
