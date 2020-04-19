import { useCallback, useMemo, useState } from "react";
import { IStockPortfolioEditProps } from ".";

export interface IStockPortfolioEditData {
	ticker: string;
	[key: string]: any;
}

export type UseDataResult = [
	{ data: readonly IStockPortfolioEditData[]; tickers: readonly string[] },
	{
		addTicker: (ticker: string) => void;
		removeTicker: (ticker: string) => void;
		setData: (data: readonly IStockPortfolioEditData[]) => void;
	}
];

export const useData = ({ stockPortfolio }: IStockPortfolioEditProps): UseDataResult => {
	const [tickers, setTickers] = useState<readonly string[]>(stockPortfolio.tickers);
	const [data, _setData] = useState<readonly IStockPortfolioEditData[]>(
		tickers.map((ticker) => ({ ticker }))
	);

	const addTicker = useCallback(
		(newTicker: string) => {
			const isDuplicate = Boolean(tickers.find((ticker) => ticker === newTicker));

			if (!newTicker || isDuplicate) {
				return;
			}

			const newTickers: readonly string[] = [newTicker, ...tickers];

			setTickers(newTickers);
			_setData(newTickers.map((ticker) => ({ ticker })));
		},
		[tickers]
	);

	const removeTicker = useCallback(
		(toRemove: string) => {
			const newTickers: readonly string[] = tickers.filter((ticker) => ticker !== toRemove);
			const isUnchanged: boolean = newTickers.length === tickers.length;

			if (isUnchanged) {
				return;
			}

			setTickers(newTickers);
			_setData(newTickers.map((ticker) => ({ ticker })));
		},
		[tickers]
	);

	const setData = useCallback((newData: readonly IStockPortfolioEditData[]) => {
		const newTickers: readonly string[] = newData
			.map(({ ticker }) => ticker)
			.filter((ticker) => !ticker);

		setTickers(newTickers);
		_setData(newData);
	}, []);

	const result: UseDataResult = useMemo(() => {
		const states = { tickers, data };
		const actions = { addTicker, removeTicker, setData };

		return [states, actions];
	}, [addTicker, data, removeTicker, setData, tickers]);

	return result;
};
