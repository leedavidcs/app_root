import { DataGrid, IHeaderConfig } from "@/client/components";
import { StockPortfolio as _StockPortfolio } from "@/client/graphql";
import { NonIdealState } from "@blueprintjs/core";
import React, { FC, useEffect, useState } from "react";

type StockPortfolio = Pick<_StockPortfolio, "headers">;

const tickerHeader: IHeaderConfig = {
	label: "ticker",
	value: "ticker",
	options: null,
	editable: false,
	frozen: true,
	resizable: true,
	width: 100
};

interface IProps {
	className?: string;
	data: readonly Record<string, any>[];
	stockPortfolio: StockPortfolio;
}

const useCurrentHeaders = ({
	stockPortfolio
}: IProps): readonly [readonly IHeaderConfig[], (headers: readonly IHeaderConfig[]) => void] => {
	const [headers, setHeaders] = useState<readonly IHeaderConfig[]>(() => [
		tickerHeader,
		...stockPortfolio.headers.map(({ name, dataKey, frozen, resizable, width }) => ({
			label: name,
			value: dataKey,
			options: null,
			editable: false,
			frozen,
			resizable,
			width
		}))
	]);

	return [headers, setHeaders];
};

export const LatestDataGrid: FC<IProps> = (props) => {
	const { className, data: _data } = props;

	const [data, setData] = useState<readonly Record<string, any>[]>(_data);

	useEffect(() => setData(_data), [_data]);

	const [headers, setHeaders] = useCurrentHeaders(props);

	if (!headers.length || !data.length) {
		return (
			<NonIdealState
				icon="search"
				title="No data available"
				description={
					<>
						<p>This portfolio has no data to display.</p>
						<p>Tickers or headers may not be configured for this portfolio.</p>
					</>
				}
			/>
		);
	}

	return (
		<DataGrid
			className={className}
			data={data}
			headers={headers}
			onDataChange={setData}
			onHeadersChange={setHeaders}
		/>
	);
};
