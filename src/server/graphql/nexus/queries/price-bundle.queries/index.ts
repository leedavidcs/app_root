import { PriceBundles } from "@/server/configs";
import { queryField } from "@nexus/schema";

export const priceBundles = queryField("priceBundles", {
	type: "PriceBundle",
	list: true,
	nullable: false,
	resolve: () => {
		return Object.keys(PriceBundles)
			.sort((a, b) => parseInt(a) - parseInt(b))
			.map((id) => ({
				...PriceBundles[id],
				id
			}));
	}
});
