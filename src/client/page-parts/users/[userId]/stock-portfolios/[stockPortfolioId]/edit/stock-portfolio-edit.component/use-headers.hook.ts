import { IHeaderConfig, IHeaderOption } from "@/client/components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IStockPortfolioEditProps } from ".";

type StockPortfolioHeader = IStockPortfolioEditProps["stockPortfolio"]["headers"][number];

type UseHeadersResult = [
	{ headers: readonly StockPortfolioHeader[]; gridHeaders: readonly IHeaderConfig[] },
	{
		addGridHeader: (option: IHeaderOption) => void;
		setGridHeaders: (gridHeaders: readonly IHeaderConfig[]) => void;
	}
];

const defaultHeaderValues: Omit<StockPortfolioHeader, "name" | "dataKey"> = {
	frozen: false,
	resizable: true,
	width: 100
};

export const useHeaders = (
	{ stockPortfolio }: IStockPortfolioEditProps,
	options: readonly IHeaderOption[]
): UseHeadersResult => {
	const tickerHeader = useMemo(
		() => ({
			...defaultHeaderValues,
			label: "ticker",
			value: "ticker",
			frozen: true,
			options: null
		}),
		[]
	);

	const [headers, _setHeaders] = useState<readonly StockPortfolioHeader[]>(() =>
		stockPortfolio.headers.map(({ __typename, ...headerProps }) => headerProps)
	);
	const [gridHeaders, _setGridHeaders] = useState<readonly IHeaderConfig[]>(() => [
		tickerHeader,
		...headers.map(({ name, dataKey, __typename, ...commonProps }) => ({
			label: name,
			value: dataKey,
			options: null,
			...commonProps
		}))
	]);

	const setHeaders = useCallback(
		(newHeaders: readonly StockPortfolioHeader[]) => {
			const newGridHeaders: readonly IHeaderConfig[] = [
				tickerHeader,
				...newHeaders.map(({ name, dataKey, __typename, ...commonProps }) => ({
					label: name,
					value: dataKey,
					...commonProps,
					options
				}))
			];

			_setHeaders(newHeaders);
			_setGridHeaders(newGridHeaders);
		},
		[options, tickerHeader]
	);

	/** Always maintain an update-request compatible version of headers to simplify the request */
	const setGridHeaders = useCallback((newGridHeaders: readonly IHeaderConfig[]) => {
		const newHeaders: readonly StockPortfolioHeader[] = newGridHeaders
			.filter(({ value }) => value !== "ticker")
			.map(({ label, value, options: _options, ...commonProps }) => ({
				name: label,
				dataKey: value,
				...commonProps
			}));

		_setHeaders(newHeaders);
		_setGridHeaders(newGridHeaders);
	}, []);

	const addGridHeader = useCallback(
		(newOption: IHeaderOption) => {
			const newHeader: StockPortfolioHeader = {
				name: newOption.label,
				dataKey: newOption.value,
				...defaultHeaderValues
			};

			const newHeaders: readonly StockPortfolioHeader[] = [newHeader, ...headers];

			setHeaders(newHeaders);
		},
		[headers, setHeaders]
	);

	/** Re-render, whenever gridHeader options are changed */
	useEffect(() => {
		gridHeaders.forEach((gridHeader) => {
			if (gridHeader.value !== "ticker") {
				gridHeader.options = options;
			}
		});

		_setGridHeaders(gridHeaders);
	}, [gridHeaders, options]);

	const result: UseHeadersResult = useMemo(() => {
		const states = { headers, gridHeaders };
		const actions = { addGridHeader, setGridHeaders };

		return [states, actions];
	}, [addGridHeader, gridHeaders, headers, setGridHeaders]);

	return result;
};
