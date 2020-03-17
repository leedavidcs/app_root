import { DataGrid, IHeaderConfig } from "@/client/components/data-grid.component";
import { Paper } from "@/client/components/paper.component";
import Faker from "faker";
import { range, uniq } from "lodash-es";
import React, { FC, useCallback, useState } from "react";

const MAX_DATA_SIZE = 100;
const MAX_COLUMN_WIDTH = 80;
const MIN_COLUMN_WIDTH = 30;
const NUMBER_FROZEN_COLUMNS = 5;

Faker.seed(1);

const MOCK_HEADER_NAMES: readonly string[] = uniq(
	[...Array(MAX_DATA_SIZE)].map(() => Faker.lorem.word())
);

const reducedSize: number = MOCK_HEADER_NAMES.length;

const MOCK_DATA: readonly Record<string, number>[] = range(reducedSize).map((i) => {
	const datum: Record<string, number> = {};

	MOCK_HEADER_NAMES.forEach((name, j) => (datum[name] = j * reducedSize + i));

	return datum;
});

const MOCK_HEADERS: readonly IHeaderConfig[] = MOCK_HEADER_NAMES.map((label, i) => ({
	label,
	value: label,
	frozen: i < NUMBER_FROZEN_COLUMNS,
	options: [{ label, value: label }],
	resizable: true,
	width: Faker.random.number({
		max: MAX_COLUMN_WIDTH,
		min: MIN_COLUMN_WIDTH
	})
}));

export const StandardStory: FC = () => {
	const [data, setData] = useState<readonly Record<string, number>[]>(MOCK_DATA);
	const [headers, setHeaders] = useState<readonly IHeaderConfig[]>(MOCK_HEADERS);

	const onDataChange = useCallback((value: readonly Record<string, number>[]) => setData(value), [
		setData
	]);

	const onHeadersChange = useCallback((value: readonly IHeaderConfig[]) => setHeaders(value), [
		setHeaders
	]);

	return (
		<Paper style={{ height: 500 }}>
			<DataGrid
				data={data}
				headers={headers}
				onDataChange={onDataChange}
				onHeadersChange={onHeadersChange}
			/>
		</Paper>
	);
};
