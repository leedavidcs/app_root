import { SnapshotConfig } from "@/server/configs";
import { objectType } from "@nexus/schema";

export const FeaturePricingConfig = objectType({
	name: "FeaturePricingConfig",
	definition: (t) => {
		t.int("price", { nullable: false });
	}
});

export const FeaturePricing = objectType({
	name: "FeaturePricing",
	definition: (t) => {
		t.field("snapshot", {
			type: "FeaturePricingConfig",
			nullable: false,
			resolve: () => ({ price: SnapshotConfig.price })
		});
	}
});
