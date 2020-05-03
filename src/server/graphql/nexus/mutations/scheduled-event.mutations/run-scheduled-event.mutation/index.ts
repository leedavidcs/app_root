import { mutationField, objectType } from "@nexus/schema";
import { Day, Recurrence, ScheduledEvent, User } from "@prisma/client";
import { oneLine } from "common-tags";
import { add, getDay, isAfter, isBefore, set, setDay } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { isFinite, isNil } from "lodash";

/* eslint-disable no-magic-numbers */
export type DayAsNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DayToNumber = (day: Day): DayAsNumber => {
	switch (day) {
		case Day.Mon:
			return 1;
		case Day.Tues:
			return 2;
		case Day.Wed:
			return 3;
		case Day.Thurs:
			return 4;
		case Day.Fri:
			return 5;
		case Day.Sat:
			return 6;
		default:
			return 0;
	}
};
/**
 * @description Given a day of the week, and an array of days of the week, return the next day of
 *     the week
 * @author David Lee
 * @date April 27, 2020
 */
const getNextDay = (prevDay: DayAsNumber, days: readonly Day[]): Maybe<DayAsNumber> => {
	const asNumbers: readonly DayAsNumber[] = days.map(DayToNumber).sort((a, b) => a - b);

	if (asNumbers.length === 0) {
		return null;
	}

	const nextDay = Math.min(...asNumbers.filter((day) => prevDay < day));

	if (isFinite(nextDay)) {
		return nextDay as DayAsNumber;
	}

	return asNumbers[0];
};

const setNextDay = (prevTime: number | Date, days: readonly Day[]): Maybe<Date> => {
	const prevDay = getDay(prevTime);
	const nextDay = getNextDay(prevDay, days);

	if (isNil(nextDay)) {
		return null;
	}

	const withNextDay: Date = setDay(prevTime, nextDay);

	const nextDate: Date = isAfter(withNextDay, prevTime)
		? withNextDay
		: add(withNextDay, { weeks: 1 });

	return nextDate;
};

export const getNextScheduledTime = (
	prevTime: number | Date,
	scheduledEvent: ScheduledEvent & { user: Pick<User, "timezone"> }
): Maybe<Date> => {
	const { timezone } = scheduledEvent.user;

	if (!scheduledEvent.interval && !scheduledEvent.recurrence) {
		return null;
	}

	if (scheduledEvent.interval) {
		return add(prevTime, { minutes: scheduledEvent.interval });
	}

	const hours: number = scheduledEvent.hour ?? 0;
	const minutes: number = scheduledEvent.minute ?? 0;

	switch (scheduledEvent.recurrence) {
		case Recurrence.Daily: {
			let newTime: Date = set(prevTime, { hours, minutes });

			if (isBefore(newTime, prevTime)) {
				newTime = add(newTime, { days: 1 });
			}

			newTime = utcToZonedTime(newTime, timezone);

			return newTime;
		}
		case Recurrence.Weekly: {
			let newTime: Maybe<Date> = setNextDay(prevTime, scheduledEvent.days);

			/** Scheduled-event is invalid. Return null */
			if (!newTime) {
				return null;
			}

			newTime = set(newTime, { hours, minutes });
			newTime = utcToZonedTime(newTime, timezone);

			return newTime;
		}
		/** Recurrence is either `Once` or invalid. Return null either way */
		default:
			return null;
	}
};

export const RunScheduledEvent = objectType({
	name: "RunScheduledEvent",
	definition: (t) => {
		t.list.field("scheduledEvents", {
			type: "ScheduledEvent",
			nullable: false
		});
		t.field("startTime", {
			type: "DateTime",
			nullable: false
		});
		t.list.field("stockDataRetrieved", {
			type: "StockPortfolioEvent",
			nullable: false,
			description: oneLine`
				Retrieves stock-data for stock-portfolios that have polling configured, and
				generates snapshots for each one.
			`,
			resolve: async ({ scheduledEvents }, args, { dataSources, prisma }) => {
				const { IexCloudAPI } = dataSources;

				const stockPortfolioEvents = await prisma.stockPortfolioEvent.findMany({
					where: {
						scheduledEventId: {
							in: scheduledEvents.map(({ id }) => id)
						}
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

				for (const { stockPortfolio } of stockPortfolioEvents) {
					await IexCloudAPI.getStockPortfolioData(stockPortfolio, stockPortfolio.user);
				}

				return stockPortfolioEvents;
			}
		});
	}
});

export const runScheduledEvent = mutationField("runScheduledEvent", {
	type: "RunScheduledEvent",
	authorize: (parent, args, { isEasyCron }) => isEasyCron,
	resolve: async (parent, args, { afterwares, prisma }) => {
		const startTime = new Date();

		const scheduledEvents = await prisma.scheduledEvent.findMany({
			where: {
				next: { lte: startTime }
			},
			include: {
				user: {
					select: {
						timezone: true
					}
				}
			}
		});

		let toDeleteIds: string[] = [];

		for (const scheduledEvent of scheduledEvents) {
			const nextDate = getNextScheduledTime(startTime, scheduledEvent);

			if (!nextDate) {
				toDeleteIds = [...toDeleteIds, scheduledEvent.id];

				continue;
			}

			await prisma.scheduledEvent.update({
				where: { id: scheduledEvent.id },
				data: { next: nextDate }
			});
		}

		afterwares.add(async () => {
			await prisma.stockPortfolioEvent.deleteMany({
				where: { scheduledEventId: { in: toDeleteIds } }
			});
			await prisma.scheduledEvent.deleteMany({
				where: { id: { in: toDeleteIds } }
			});
		});

		return { scheduledEvents, startTime };
	}
});
