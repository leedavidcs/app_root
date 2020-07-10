import { IHeaderConfig, IHeaderOption } from "@/client/components";
import { useToast } from "@/client/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IStockPortfolioEditProps } from ".";

type StockPortfolioHeader = IStockPortfolioEditProps["stockPortfolio"]["headers"][number];

type UseHeadersResult = [
	{ headers: readonly StockPortfolioHeader[]; gridHeaders: readonly IHeaderConfig[] },
	{
		addGridHeader: (option: IHeaderOption) => void;
		onHeadersError: (message: string) => void;
		setGridHeaders: (gridHeaders: readonly IHeaderConfig[]) => void;
	}
];

const defaultHeaderConfig: Omit<IHeaderConfig, "label" | "value" | "options"> = {
	frozen: false,
	resizable: true,
	width: 100
};

export const useHeaders = (
	{ stockPortfolio }: IStockPortfolioEditProps,
	options: readonly IHeaderOption[]
): UseHeadersResult => {
	const toast = useToast();

	const tickerHeader = useMemo(
		() => ({
			...defaultHeaderConfig,
			editable: false,
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
		...headers.map(({ name, dataKey, frozen, resizable, width }) => ({
			label: name,
			value: dataKey,
			options: null,
			frozen,
			resizable,
			width
		}))
	]);

	const setHeaders = useCallback(
		(newHeaders: readonly StockPortfolioHeader[]) => {
			const newGridHeaders: readonly IHeaderConfig[] = [
				tickerHeader,
				...newHeaders.map(({ name, dataKey, frozen, resizable, width }) => ({
					label: name,
					value: dataKey,
					options,
					frozen,
					resizable,
					width
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
			.map(({ label, value, frozen, resizable, width }) => ({
				name: label,
				dataKey: value,
				frozen,
				resizable,
				width
			}));

		_setHeaders(newHeaders);
		_setGridHeaders(newGridHeaders);
	}, []);

	const onHeadersError = useCallback(
		(message: string) => toast.show({ message, intent: "warning" }),
		[toast]
	);

	const addGridHeader = useCallback(
		(newOption: IHeaderOption) => {
			const isDuplicateOption: boolean =
				gridHeaders.findIndex(({ label }) => newOption.label === label) !== -1;

			if (isDuplicateOption) {
				toast.show({
					message: "Cannot add column with non-unique name",
					intent: "warning"
				});

				return;
			}

			const newHeader: StockPortfolioHeader = {
				name: newOption.label,
				dataKey: newOption.value,
				...defaultHeaderConfig
			};

			const newHeaders: readonly StockPortfolioHeader[] = [newHeader, ...headers];

			setHeaders(newHeaders);
		},
		[gridHeaders, headers, setHeaders, toast]
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

	const states = useMemo(() => ({ headers, gridHeaders }), [gridHeaders, headers]);
	const actions = useMemo(() => ({ addGridHeader, onHeadersError, setGridHeaders }), [
		addGridHeader,
		onHeadersError,
		setGridHeaders
	]);

	const result: UseHeadersResult = useMemo(() => {
		return [states, actions];
	}, [actions, states]);

	return result;
};
