import { NotFoundError } from "@/server/utils";
import { arg, inputObjectType, queryField, stringArg } from "@nexus/schema";
import { oneLine } from "common-tags";

export const StockDataWhereUniqueInput = inputObjectType({
	name: "StockDataWhereUniqueInput",
	definition: (t) => {
		t.string("stockPortfolioId", { nullable: false });
	}
});

export const stockData = queryField("stockData", {
	type: "StockData",
	description: oneLine`
		Query version of the mutation \`getStockData\`. The \`StockData\` type inherently results
		in data mutations. As a result, this operation exists both as a query and mutation.
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

export const stockSymbols = queryField("stockSymbols", {
	type: "StockDataSearch",
	list: true,
	nullable: false,
	args: {
		text: stringArg({ nullable: false })
	},
	rateLimit: () => ({ window: "1s", max: 30 }),
	resolve: (parent, { text }, { dataSources }) => {
		const { IexCloudAPI } = dataSources;

		if (!text) {
			return [];
		}

		return IexCloudAPI.search(text);
	}
});
