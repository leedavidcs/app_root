import { queryField } from "@nexus/schema";

export const featurePricing = queryField("featurePricing", {
	type: "FeaturePricing",
	nullable: false,
	resolve: () => ({})
});
