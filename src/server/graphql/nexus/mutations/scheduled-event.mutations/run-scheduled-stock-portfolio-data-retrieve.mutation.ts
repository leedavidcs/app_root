import { getNextScheduledTime } from "@/server/utils";
import { mutationField } from "@nexus/schema";
import { StockPortfolioEventType } from "@prisma/client";
import { oneLine } from "common-tags";

export const runScheduledStockPortfolioDataRetrieve = mutationField(
	"runScheduledStockPortfolioDataRetrieve",
	{
		type: "StockPortfolioEvent",
		list: true,
		nullable: false,
		description: oneLine`
			StockData must be requested as part of the request for this to properly retrieve all
			data.
		`,
		authorize: (parent, args, { isEasyCron }) => isEasyCron,
		resolve: async (parent, args, { dataSources, prisma }) => {
			const { IexCloudAPI } = dataSources;

			const currentTimeUtc = new Date();

			const stockPortfolioEvents = await prisma.stockPortfolioEvent.findMany({
				where: {
					scheduledEvent: {
						next: { lte: currentTimeUtc }
					},
					type: StockPortfolioEventType.DataRetrieved
				},
				include: {
					scheduledEvent: true,
					stockPortfolio: {
						select: {
							id: true,
							tickers: true,
							user: {
								select: {
									id: true,
									timezone: true
								}
							}
						}
					}
				}
			});

			for (const { scheduledEvent, stockPortfolio } of stockPortfolioEvents) {
				const { user } = stockPortfolio;

				await IexCloudAPI.getStockPortfolioData(stockPortfolio, stockPortfolio.user);

				const nextDate = getNextScheduledTime(currentTimeUtc, scheduledEvent, user);

				/** If invalid, or is 1-time recurrence, delete scheduled event */
				if (!nextDate) {
					await prisma.scheduledEvent.delete({ where: { id: scheduledEvent.id } });

					continue;
				}

				await prisma.scheduledEvent.update({
					where: { id: scheduledEvent.id },
					data: { next: nextDate }
				});
			}

			return prisma.stockPortfolioEvent.findMany({
				where: {
					scheduledEventId: {
						in: stockPortfolioEvents.map(({ scheduledEventId }) => scheduledEventId)
					}
				}
			});
		}
	}
);
