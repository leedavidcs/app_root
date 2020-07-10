import { DataSource } from "apollo-datasource";
import { isFunction } from "lodash";
import ms from "ms";
import PQueue from "p-queue";
import Stripe from "stripe";

const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY ?? "";
const isProduction: boolean = process.env.NODE_ENV === "production";

const TEST_MODE_RATE_LIMIT = 25;
const PROD_MODE_RATE_LIMIT = 100;
const STRIPE_API_RATE_LIMIT = isProduction ? PROD_MODE_RATE_LIMIT : TEST_MODE_RATE_LIMIT;

/**
 * @description Stripe has a rate limit of 100 requests / 1s. We are requesting half that rate for
 *     safety.
 * @see (@link https://stripe.com/docs/rate-limits#handling-limiting-gracefully)
 * @author David Lee
 * @date May 18, 2020
 */
const queue = new PQueue({
	concurrency: STRIPE_API_RATE_LIMIT / 2,
	interval: ms("1s"),
	intervalCap: STRIPE_API_RATE_LIMIT / 2
});

export class StripeAPI extends DataSource {
	private stripe = new Stripe(stripeSecretKey, {
		apiVersion: "2020-03-02",
		typescript: true,
		maxNetworkRetries: 2
	});

	private withRateLimit = <
		TResource extends keyof Stripe,
		TOperation extends keyof Stripe[TResource]
	>(
		resource: TResource,
		operationName: TOperation
	): Stripe[TResource][TOperation] => {
		const fn = this.stripe[resource][operationName];

		if (!isFunction(fn)) {
			throw new Error(`Stripe.${resource}.${operationName} is not a function`);
		}

		const rateLimitedFn = ((...params: any) => {
			return queue.add(() => fn.call(this.stripe[resource], ...params));
		}) as any;

		return rateLimitedFn;
	};

	public customers = {
		create: this.withRateLimit("customers", "create"),
		retrieve: this.withRateLimit("customers", "retrieve")
	};

	public paymentIntents = {
		cancel: this.withRateLimit("paymentIntents", "cancel"),
		create: this.withRateLimit("paymentIntents", "create"),
		retrieve: this.withRateLimit("paymentIntents", "retrieve")
	};

	public paymentMethods = {
		retrieve: this.withRateLimit("paymentMethods", "retrieve")
	};

	public setupIntents = {
		cancel: this.withRateLimit("setupIntents", "cancel"),
		create: this.withRateLimit("setupIntents", "create"),
		retrieve: this.withRateLimit("setupIntents", "retrieve")
	};
}
