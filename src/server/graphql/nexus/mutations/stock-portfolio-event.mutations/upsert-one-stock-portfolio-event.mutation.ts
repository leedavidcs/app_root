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
		create: object({
			scheduledEvent: object({
				create: lazy<any>((value) => {
					if (typeof value.interval === "number") {
						return object({ interval: number().required() }).noUnknown();
					}

					return object({
						recurrence: string()
							.required()
							.oneOf<Recurrence>([
								Recurrence.Daily,
								Recurrence.Once,
								Recurrence.Weekly
							]),
						days: object().when("recurrence", {
							is: Recurrence.Weekly,
							then: object({
								set: array<Day>()
									.of(
										string().oneOf<Day>([
											Day.Mon,
											Day.Tues,
											Day.Wed,
											Day.Thurs,
											Day.Fri,
											Day.Sat,
											Day.Sun
										])
									)
									.required()
									.min(1)
							}).required()
						}),
						hour: number(),
						minute: number()
					}).noUnknown();
				})
			}).required()
		}),
		update: object({
			scheduledEvent: object({
				update: lazy<any>((value) => {
					if (typeof value.interval === "number") {
						return object({ interval: number().required() }).transform(
							(scheduledEvent) => ({
								...scheduledEvent,
								recurrence: null,
								days: { set: [] },
								hour: 0,
								minute: 0
							})
						);
					}

					return object({
						recurrence: string()
							.required()
							.oneOf<Recurrence>([
								Recurrence.Daily,
								Recurrence.Once,
								Recurrence.Weekly
							]),
						days: object().when("recurrence", {
							is: Recurrence.Weekly,
							then: object({
								set: array<Day>()
									.of(
										string().oneOf<Day>([
											Day.Mon,
											Day.Tues,
											Day.Wed,
											Day.Thurs,
											Day.Fri,
											Day.Sat,
											Day.Sun
										])
									)
									.required()
									.min(1)
							}).required()
						}),
						hour: number(),
						minute: number()
					}).transform((scheduledEvent) => ({
						...scheduledEvent,
						interval: null
					}));
				})
			}).required()
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
