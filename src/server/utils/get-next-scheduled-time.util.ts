import { Day, Recurrence, ScheduledEvent, User } from "@prisma/client";
import { add, getDay, isAfter, set, setDay } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { isFinite, isNil } from "lodash";
import { DayAsNumber, DayToNumber } from "./enums.util";

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
	scheduledEvent: ScheduledEvent,
	user: Pick<User, "timezone">
): Maybe<Date> => {
	const { timezone } = user;

	if (!scheduledEvent.interval || !scheduledEvent.recurrence) {
		return null;
	}

	if (scheduledEvent.interval) {
		return add(prevTime, { minutes: scheduledEvent.interval });
	}

	const hours: number = scheduledEvent.hour ?? 0;
	const minutes: number = scheduledEvent.minute ?? 0;

	switch (scheduledEvent.recurrence) {
		case Recurrence.Daily: {
			const tomorrow: Date = add(prevTime, { days: 1 });

			const withTime: Date = set(tomorrow, { hours, minutes });
			const withTimezone: Date = utcToZonedTime(withTime, timezone);

			return withTimezone;
		}
		case Recurrence.Weekly: {
			const nextDate: Maybe<Date> = setNextDay(prevTime, scheduledEvent.days);

			/** Scheduled-event is invalid. Return null */
			if (!nextDate) {
				return null;
			}

			const withTime: Date = set(nextDate, { hours, minutes });
			const withTimezone: Date = utcToZonedTime(withTime, timezone);

			return withTimezone;
		}
		/** Recurrence is either `Once` or invalid. Return null either way */
		default:
			return null;
	}
};
