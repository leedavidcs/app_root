import { arg, mutationField } from "@nexus/schema";

export const deleteOneStockPortfolioEvent = mutationField("deleteOneStockPortfolioEvent", {
	type: "StockPortfolioEvent",
	args: {
		where: arg({ type: "StockPortfolioEventWhereUniqueInput", nullable: false })
	},
	authorize: async (parent, { where }, { prisma, user }) => {
		if (!user) {
			return false;
		}

		const stockPortfolioEvent = await prisma.stockPortfolioEvent.findOne({
			where,
			include: { scheduledEvent: true }
		});

		if (!stockPortfolioEvent) {
			return true;
		}

		if (stockPortfolioEvent.scheduledEvent.userId !== user.id) {
			return false;
		}

		return true;
	},
	resolve: async (parent, { where }, { prisma }) => {
		const stockPortfolioEvent = await prisma.stockPortfolioEvent.findOne({ where });

		await prisma.stockPortfolioEvent.delete({ where });
		await prisma.scheduledEvent.delete({
			where: { id: stockPortfolioEvent?.scheduledEventId }
		});

		return stockPortfolioEvent;
	}
});
