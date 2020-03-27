import { IexCloudAPI } from "./iex-cloud.datasource";

export * from "./iex-cloud.datasource";

export const dataSources = () => ({
	IexCloudAPI: new IexCloudAPI()
});
