import { arg, inputObjectType, mutationField } from "@nexus/schema";
import ms from "ms";
import { number, object } from "yup";

const MS_PER_MINUTE: number = ms("1m");
const CRON_INTERVAL: string = process.env.CRON_INTERVAL ?? "20m";
const MS_CRON_INTERVAL: number = ms(CRON_INTERVAL);

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
		t.int("pollInterval", {
			description:
				"The time, in minutes, for when more data should be fetched for the stock-portfolio"
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
	yupValidation: () => ({
		data: object().shape({
			pollInterval: number()
				.min(0, "PollInterval must be at least 0")
				.test({
					message: `PollInterval must be in intervals of ${CRON_INTERVAL}`,
					test: (value) => {
						const inMs: number = value * MS_PER_MINUTE;

						return inMs === 0 || inMs % MS_CRON_INTERVAL === 0;
					}
				})
		})
	}),
	resolve: (parent, args, { prisma }) => prisma.stockPortfolioSettings.update(args)
});
