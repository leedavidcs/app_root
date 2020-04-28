import { NotFoundError } from "@/server/utils";
import { arg, mutationField } from "@nexus/schema";
import { ForbiddenError } from "apollo-server-micro";
import { isNil } from "lodash";
import { object } from "yup";

export const upsertOneStockPortfolioEvent = mutationField("upsertOneStockPortfolioEvent", {
	type: "StockPortfolioEvent",
	nullable: false,
	args: {
		where: arg({ type: "StockPortfolioEventWhereUniqueInput", nullable: false }),
		create: arg({ type: "StockPortfolioEventCreateInput", nullable: false }),
		update: arg({ type: "StockPortfolioEventUpdateInput", nullable: false })
	},
	authorize: async (parent, { where, create }, { prisma, user }) => {
		if (!user) {
			return false;
		}

		const toUpdate = await prisma.stockPortfolioEvent.findOne({
			where,
			include: { stockPortfolio: true }
		});

		if (toUpdate && toUpdate.stockPortfolio.userId !== user.id) {
			return new ForbiddenError(
				"Cannot update a stock-portfolio belonging to a different user"
			);
		}

		const stockPortfolio = await prisma.stockPortfolio.findOne({
			where: { ...create.stockPortfolio.connect }
		});

		if (!stockPortfolio) {
			return new NotFoundError("Stock-portfolio could not be found");
		}

		if (stockPortfolio.userId !== user.id) {
			return new ForbiddenError(
				"Cannot create an event for a stock-portfolio belonging to a different user"
			);
		}

		return true;
	},
	yupValidation: () => ({
		create: object().shape({
			scheduledEvent: object().test({
				message: "ScheduledEvent must either have interval, or explicit scheduling",
				test: (value) => {
					if (!isNil(value.interval)) {
						return true;
					}

					if (!isNil(value.hour) && !isNil(value.minute) && value.days?.length > 0) {
						return true;
					}

					return false;
				}
			})
		}),
		update: object().shape({
			scheduledEvent: object().test({
				message: "ScheduledEvent must either have interval, or explicit scheduling",
				test: (value) => {
					if (!isNil(value.interval)) {
						return true;
					}

					if (!isNil(value.hour) && !isNil(value.minute) && value.days?.length > 0) {
						return true;
					}

					return false;
				}
			})
		})
	}),
	resolve: (parent, { where, create, update }, { prisma, user }) => {
		return prisma.stockPortfolioEvent.upsert({
			where,
			create: {
				...create,
				scheduledEvent: {
					create: {
						...create.scheduledEvent.create,
						user: { connect: { id: user.id } }
					}
				}
			},
			update
		});
	}
});
