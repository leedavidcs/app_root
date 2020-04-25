import { extendType } from "@nexus/schema";

export const updateOneStockPortfolioEvent = extendType({
	type: "Mutation",
	definition: (t) => {
		t.crud.updateOneStockPortfolioEvent();
	}
});
