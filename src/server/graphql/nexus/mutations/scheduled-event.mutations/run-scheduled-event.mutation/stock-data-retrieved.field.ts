import { Logger } from "@/server/utils";
import { extendType } from "@nexus/schema";
import { StockPortfolioEventType } from "@prisma/client";
import { mapLimit } from "blend-promise-utils";
import { oneLine } from "common-tags";

const STOCK_DATA_RETRIEVED_PARALLEL_LIMIT = 5;

export const stockDataRetrieved = extendType({
	type: "RunScheduledEvent",
	definition: (t) => {
		t.list.field("stockDataRetrieved", {
			type: "StockPortfolioEvent",
			description: oneLine`
				Retrieves stock-data for stock-portfolios that have polling configured, and
				generates snapshots for each one.
			`,
			authorize: (parent, args, { isEasyCron }) => isEasyCron(),
			resolve: async ({ scheduledEvents }, args, { dataSources, prisma }) => {
				const { IexCloudAPI } = dataSources;

				const stockPortfolioEvents = await prisma.stockPortfolioEvent.findMany({
					where: {
						scheduledEventId: {
							in: scheduledEvents.map(({ id }) => id)
						},
						type: StockPortfolioEventType.DataRetrieved
					},
					include: {
						stockPortfolio: {
							select: {
								id: true,
								tickers: true,
								user: {
									select: {
										id: true
									}
								}
							}
						}
					}
				});

				await mapLimit(
					stockPortfolioEvents,
					STOCK_DATA_RETRIEVED_PARALLEL_LIMIT,
					async ({ stockPortfolio }) => {
						try {
							await IexCloudAPI.getStockPortfolioData(
								stockPortfolio,
								stockPortfolio.user
							);
						} catch (err) {
							Logger.error(err.message ?? err);
						}
					}
				);

				return stockPortfolioEvents;
			}
		});
	}
});
