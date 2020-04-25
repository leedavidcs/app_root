import { NotFoundError } from "@/server/utils";
import { arg, inputObjectType, mutationField } from "@nexus/schema";
import { ForbiddenError } from "apollo-server-micro";
import { isNil } from "lodash";
import { object } from "yup";

export const ScheduledEventCreatedaysInput = inputObjectType({
	name: "ScheduledEventCreatedaysInput",
	definition: (t) => {
		t.list.field("set", { type: "Day" });
	}
});

export const ScheduledEventCreateWithoutStockPortfolioEventInput = inputObjectType({
	name: "ScheduledEventCreateWithoutStockPortfolioEventInput",
	definition: (t) => {
		t.int("hour");
		t.int("minute");
		t.int("interval");
		t.string("timezone");
		t.field("days", { type: "ScheduledEventCreatedaysInput" });
	}
});

export const ScheduledEventCreateOneWithoutStockPortfolioEventInput = inputObjectType({
	name: "ScheduledEventCreateOneWithoutStockPortfolioEventInput",
	definition: (t) => {
		t.field("create", {
			type: "ScheduledEventCreateWithoutStockPortfolioEventInput",
			nullable: false
		});
	}
});

export const StockPortfolioCreateOneWithoutStockPortfolioEventInput = inputObjectType({
	name: "StockPortfolioCreateOneWithoutStockPortfolioEventInput",
	definition: (t) => {
		t.field("connect", { type: "StockPortfolioWhereUniqueInput", nullable: false });
	}
});

export const StockPortfolioEventCreateInput = inputObjectType({
	name: "StockPortfolioEventCreateInput",
	definition: (t) => {
		t.field("type", { type: "StockPortfolioEventType", nullable: false });
		t.field("scheduledEvent", {
			type: "ScheduledEventCreateOneWithoutStockPortfolioEventInput",
			nullable: false
		});
		t.field("stockPortfolio", {
			type: "StockPortfolioCreateOneWithoutStockPortfolioEventInput",
			nullable: false
		});
	}
});

export const createOneStockPortfolioEvent = mutationField("createOneStockPortfolioEvent", {
	type: "StockPortfolioEvent",
	nullable: false,
	args: {
		data: arg({ type: "StockPortfolioEventCreateInput", nullable: false })
	},
	authorize: async (parent, { data }, { prisma, user }) => {
		if (!user) {
			return false;
		}

		const stockPortfolio = await prisma.stockPortfolio.findOne({
			where: data.stockPortfolio.connect
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
		data: object().shape({
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
	resolve: (parent, { data }, { prisma, user }) => {
		return prisma.stockPortfolioEvent.create({
			data: {
				...data,
				scheduledEvent: {
					create: {
						...data.scheduledEvent.create,
						user: { connect: { id: user.id } }
					}
				}
			}
		});
	}
});
