import { rql } from "@/scripts/generate-stock-schema.script/rest-ql";
import { oneLine } from "common-tags";
import * as fields from "./fields";

export const iexCloud = rql.providerObjectType({
	description: oneLine`
		Market data, provided by [IEX Cloud](https://iexcloud.io/)
	`,
	fields
});
