import { AlpacaAPI } from "./alpaca.datasource";
import { IexCloudAPI } from "./iex-cloud.datasource";
import { StripeAPI } from "./stripe.datasource";

export * from "./iex-cloud.datasource";

export const dataSources = () => ({
	AlpacaAPI: new AlpacaAPI(),
	IexCloudAPI: new IexCloudAPI(),
	StripeAPI: new StripeAPI()
});
