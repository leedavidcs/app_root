import { PrismaUtils } from "@/server/utils";
import { arg, inputObjectType, mutationField } from "@nexus/schema";

export const StockPortfolioSettingsWhereUniqueInput = inputObjectType({
	name: "StockPortfolioSettingsWhereUniqueInput",
	definition: (t) => {
		t.string("stockPortfolioId", { nullable: false });
	}
});

export const StockPortfolioSettingsUpdateInput = inputObjectType({
	name: "StockPortfolioSettingsUpdateInput",
	definition: (t) => {
		t.boolean("enableSnapshots", {
			description:
				"Whether snapshots should be saved per-data-refresh of this stock-portfolio"
		});
	}
});

export const updateOneStockPortfolioSettings = mutationField("updateOneStockPortfolioSettings", {
	type: "StockPortfolioSettings",
	args: {
		where: arg({ type: "StockPortfolioSettingsWhereUniqueInput", nullable: false }),
		data: arg({ type: "StockPortfolioSettingsUpdateInput", nullable: false })
	},
	rateLimit: () => ({ window: "1m", max: 30 }),
	authorize: async (parent, { where }, { prisma, user }) => {
		if (!user) {
			return false;
		}

		const stockPortfolio = await prisma.stockPortfolio.findOne({
			where: { id: where.stockPortfolioId }
		});

		if (user.id !== stockPortfolio?.userId) {
			return false;
		}

		return true;
	},
	resolve: (parent, args, { prisma }) => {
		const casted = PrismaUtils.castInputs(args);

		return prisma.stockPortfolioSettings.update(casted);
	}
});
