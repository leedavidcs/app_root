import { NotFoundError } from "@/server/utils";
import { arg, mutationField } from "@nexus/schema";
import { Day, Recurrence } from "@prisma/client";
import { ForbiddenError } from "apollo-server-micro";
import { array, lazy, number, object, string } from "yup";

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
			scheduledEvent: object()
				.required()
				.shape({
					create: lazy<any>((value) => {
						if (typeof value.interval === "number") {
							return object()
								.shape({
									interval: number().required()
								})
								.noUnknown();
						}

						return object()
							.shape({
								recurrence: string<Recurrence>().required(),
								days: object().when("recurrence", {
									is: Recurrence.Weekly,
									then: object()
										.shape({
											set: array<Day>().of(string<Day>()).required().min(1)
										})
										.required()
								}),
								hour: number(),
								minute: number()
							})
							.noUnknown();
					})
				})
		}),
		update: object().shape({
			scheduledEvent: object()
				.required()
				.shape({
					update: lazy<any>((value) => {
						if (typeof value.interval === "number") {
							return object()
								.shape({
									interval: number().required()
								})
								.transform((scheduledEvent) => ({
									...scheduledEvent,
									recurrence: null,
									days: { set: [] },
									hour: 0,
									minute: 0
								}));
						}

						return object()
							.shape({
								recurrence: string<Recurrence>().required(),
								days: object().when("recurrence", {
									is: Recurrence.Weekly,
									then: object()
										.shape({
											set: array<Day>().of(string<Day>()).required().min(1)
										})
										.required()
								}),
								hour: number(),
								minute: number()
							})
							.transform((scheduledEvent) => ({
								...scheduledEvent,
								interval: null
							}));
					})
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
