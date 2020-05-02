import { arg, inputObjectType, queryField } from "@nexus/schema";
import { ForbiddenError } from "apollo-server-micro";

export const StockPortfolioIdTypeCompoundUniqueInput = inputObjectType({
	name: "StockPortfolioIdTypeCompoundUniqueInput",
	definition: (t) => {
		t.string("stockPortfolioId", { nullable: false });
		t.field("type", { type: "StockPortfolioEventType", nullable: false });
	}
});

export const StockPortfolioEventWhereUniqueInput = inputObjectType({
	name: "StockPortfolioEventWhereUniqueInput",
	definition: (t) => {
		t.string("scheduledEventId");
		t.field("stockPortfolioId_type", { type: "StockPortfolioIdTypeCompoundUniqueInput" });
	}
});

export const stockPortfolioEvent = queryField("stockPortfolioEvent", {
	type: "StockPortfolioEvent",
	args: {
		where: arg({ type: "StockPortfolioEventWhereUniqueInput", nullable: false })
	},
	authorize: (parent, args, { user }) => Boolean(user),
	resolve: async (parent, { where }, { prisma, user }) => {
		const result = await prisma.stockPortfolioEvent.findOne({
			where,
			include: {
				stockPortfolio: true
			}
		});

		if (result?.stockPortfolio.userId !== user.id) {
			throw new ForbiddenError(
				"Cannot retrieve stock-portfolio-event belonging to a different user"
			);
		}

		return result;
	}
});
