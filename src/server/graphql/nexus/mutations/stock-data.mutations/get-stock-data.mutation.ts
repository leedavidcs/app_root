import { NotFoundError } from "@/server/utils";
import { arg, mutationField } from "@nexus/schema";
import { oneLine } from "common-tags";

export const getStockData = mutationField("getStockData", {
	type: "StockData",
	description: oneLine`
		Mutation version of the query \`stockData\`. The \`StockData\` type inherently results in
		data mutations. As a result, this operation exists both as a query and mutation.
	`,
	args: {
		where: arg({ type: "StockDataWhereUniqueInput", nullable: false })
	},
	rateLimit: () => ({ window: "1m", max: 30 }),
	resolve: async (parent, { where }, { prisma }) => {
		const stockPortfolio = await prisma.stockPortfolio.findOne({
			where: { id: where.stockPortfolioId }
		});

		if (!stockPortfolio) {
			throw new NotFoundError();
		}

		return { stockPortfolio };
	}
});
