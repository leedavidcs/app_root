import { AlpacaAPI } from "./alpaca.datasource";
import { IexCloudAPI } from "./iex-cloud.datasource";

export * from "./iex-cloud.datasource";

export const dataSources = () => ({
	AlpacaAPI: new AlpacaAPI(),
	IexCloudAPI: new IexCloudAPI()
});
