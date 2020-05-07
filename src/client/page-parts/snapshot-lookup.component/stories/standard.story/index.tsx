import { Snapshot as _Snapshot } from "@/client/graphql/generated";
import { SnapshotLookup } from "@/client/page-parts/snapshot-lookup.component";
import { DateRange } from "@blueprintjs/datetime";
import { action } from "@storybook/addon-actions";
import React, { FC, useCallback, useState } from "react";

type Snapshot = Pick<_Snapshot, "id" | "tickers" | "headers" | "data" | "createdAt">;

export const StandardStory: FC = () => {
	const [dateRange, setDateRange] = useState<DateRange>([null, null]);
	const [snapshot, setSnapshot] = useState<Snapshot>();

	const onDateRangeChange = useCallback((newDateRange: DateRange) => {
		action("onDateRangechange")(newDateRange);
		setDateRange(newDateRange);
	}, []);

	const onChange = useCallback((selected: Snapshot) => {
		action("onChange")(selected);
		setSnapshot(selected);
	}, []);

	return (
		<SnapshotLookup
			dateRange={dateRange}
			onChange={onChange}
			onDateRangeChange={onDateRangeChange}
			selected={snapshot}
			stockPortfolioId=""
		/>
	);
};
