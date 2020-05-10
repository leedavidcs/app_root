import { DataGrid, IHeaderConfig } from "@/client/components";
import { Snapshot, StockPortfolio as _StockPortfolio } from "@/client/graphql";
import { NonIdealState } from "@blueprintjs/core";
import classnames from "classnames";
import { format } from "date-fns";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useStyles } from "./styles";

type StockPortfolio = Pick<_StockPortfolio, "headers"> & {
	latestSnapshot?: Maybe<Pick<Snapshot, "createdAt" | "data">>;
};

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
	const { className, stockPortfolio } = props;

	const classes = useStyles();

	const [data, setData] = useState<readonly Record<string, any>[]>(
		stockPortfolio.latestSnapshot?.data ?? []
	);

	useEffect(() => setData(stockPortfolio.latestSnapshot?.data ?? []), [
		stockPortfolio.latestSnapshot
	]);

	const [headers, setHeaders] = useCurrentHeaders(props);

	const createdAt: string = useMemo(
		() => format(new Date(stockPortfolio.latestSnapshot?.createdAt), "Ppp O"),
		[stockPortfolio.latestSnapshot]
	);

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
		<div className={classnames(classes.root, className)}>
			<p>Data from {createdAt}:</p>
			<DataGrid
				className={classes.dataGrid}
				data={data}
				headers={headers}
				onDataChange={setData}
				onHeadersChange={setHeaders}
			/>
		</div>
	);
};
