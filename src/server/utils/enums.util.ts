import { Day } from "@prisma/client";

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
