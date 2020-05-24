declare module "@alpacahq/alpaca-trade-api" {
	export type OrderType = "market" | "limit" | "stop" | "stop_limit";
	export type OrderSide = "buy" | "sell";
	export type OrderTimeInForce = "day" | "gtc" | "opg" | "ioc";
	export type OrderStatus =
		| "new"
		| "partially_filled"
		| "filled"
		| "done_for_day"
		| "canceled"
		| "expired"
		| "replaced"
		| "pending_cancel"
		| "pending_replace"
		| "accepted"
		| "pending_new"
		| "accepted_for_bidding"
		| "stopped"
		| "rejected"
		| "suspended"
		| "calculated";
	export type OrderBy = "asc" | "desc";

	export type Order = {
		id: string;
		client_order_id: string;
		created_at?: Maybe<string>;
		updated_at?: Maybe<string>;
		submitted_at?: Maybe<string>;
		filled_at?: Maybe<string>;
		expired_at?: Maybe<string>;
		canceled_at?: Maybe<string>;
		failed_at?: Maybe<string>;
		replaced_at?: Maybe<string>;
		replaced_by?: Maybe<string>;
		replaces?: Maybe<string>;
		asset_id: string;
		symbol: string;
		asset_class: string;
		qty: string;
		filled_qty: string;
		type: OrderType;
		side: OrderSide;
		time_in_force: string;
		limit_price?: Maybe<string>;
		stop_price?: Maybe<string>;
		filled_avg_price?: Maybe<string>;
		status: OrderStatus;
		extended_hours: boolean;
		legs: readonly Order[];
	};

	export type CreateOrderParams = {
		symbol: string;
		qty: number;
		side: OrderSide;
		type: OrderType;
		time_in_force: OrderTimeInForce;
		limit_price: number;
		stop_price: number;
		client_order_id?: string;
	};

	export type GetOrdersParams = {
		status: Pick<OrderStatus, "open" | "closed" | "all">;
		after: Date;
		until: Date;
		limit: number;
		direction: OrderBy;
	};

	export type Position = {
		asset_id: string;
		symbol: string;
		exchange: string;
		asset_class: string;
		avg_entry_price: string;
		qty: string;
		side: string;
		market_value: string;
		cost_basis: string;
		unrealized_pl: string;
		unrealized_plpc: string;
		unrealized_intraday_pl: string;
		unrealized_intraday_plpc: string;
		current_price: string;
		lastday_price: string;
		change_today: string;
	};

	export type Clock = {
		timestamp: string;
		is_open: boolean;
		next_open: string;
		next_close: string;
	};

	export type LastQuoteObject = {
		askprice: number;
		asksize: number;
		askexchange: number;
		bidprice: number;
		bidsize: number;
		bidexchange: number;
		timestamp: number;
	};

	export type LastTradeObject = {
		price: number;
		size: number;
		exchange: number;
		cond1: number;
		cond2: number;
		cond3: number;
		cond4: number;
		timestamp: number;
	};

	export type LastResponseObject<TLast extends Record<string, any>> = {
		status: string;
		symbol: string;
		last: TLast;
	};

	export type AlpacaConfig = {
		keyId: string;
		secretKey: string;
		paper: boolean;
		usePolygon: boolean;
	};

	export default class Alpaca {
		constructor(config: AlpacaConfig);

		public createOrder(params: CreateOrderParams): Promise<Order>;

		public getOrders(params: GetOrdersParams): Promise<readonly Order[]>;

		public getOrder(uuid: string): Promise<Order>;

		public getOrderByClientOrderId(clientOrderId: string): Promise<Order>;

		public replaceOrder(uuid: string): Promise<Order>;

		public cancelOrder(uuid: string): Promise<Order>;

		public cancelAllOrders(): Promise<void>;

		public getPosition(symbol: string): Promise<Position>;

		public getPositions(): Promise<readonly Position[]>;

		public closePosition(symbol: string): Promise<void>;

		public closeAllPositions(): Promise<void>;

		public getClock(): Promise<Clock>;

		public lastQuote(symbol: string): Promise<LastResponseObject<LastQuoteObject>>;

		public lastTrade(symbol: string): Promise<LastResponseObject<LastTradeObject>>;
	}
}
