import { arg, inputObjectType, mutationField } from "@nexus/schema";
import { StockPortfolio } from "@prisma/client";
import { getUniqueName } from "./get-unique-name";

export const StockPortfolioCreateInput = inputObjectType({
	name: "StockPortfolioCreateInput",
	definition: (t) => {
		t.string("name", {
			nullable: false
		});
	}
});

export const createOneStockPortfolio = mutationField("createOneStockPortfolio", {
	type: "StockPortfolio",
	nullable: false,
	args: {
		data: arg({
			type: "StockPortfolioCreateInput",
			required: true
		})
	},
	rateLimit: () => ({ window: "1m", max: 30 }),
	authorize: (parent, args, { user }) => {
		if (!user) {
			return false;
		}

		return true;
	},
	resolve: async (parent, { data }, ctx) => {
		const { prisma, user } = ctx;

		const uniqueName: string = await getUniqueName(data.name, ctx);

		const stockPortfolio: StockPortfolio = await prisma.stockPortfolio.create({
			data: {
				user: { connect: { id: user.id } },
				name: uniqueName,
				tickers: { set: [] },
				stockPortfolioSettings: { create: {} }
			}
		});

		return stockPortfolio;
	}
});
