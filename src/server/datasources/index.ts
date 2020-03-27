import { IexCloudAPI } from "./iex-cloud.datasource";
import { IexAPI } from "./iex.datasource";

export * from "./iex.datasource";

export const dataSources = () => ({
	IexAPI: new IexAPI(),
	IexCloudAPI: new IexCloudAPI()
});
