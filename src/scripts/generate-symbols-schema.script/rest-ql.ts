import { RestQL } from "@/scripts/rest-ql";
import { IexCloudAPI } from "@/server/datasources/iex-cloud-v2.datasource";

interface IContext {
	dataSources: {
		IexCloudAPIv2: IexCloudAPI;
	};
}

interface IRequestArgs {
	symbols: readonly string[];
}

interface IGroupByArgs {
	symbol: string;
}

export const rql = new RestQL<IContext, IRequestArgs, IGroupByArgs>({
	context: {
		dataSources: {
			IexCloudAPIv2: new IexCloudAPI()
		}
	}
});
