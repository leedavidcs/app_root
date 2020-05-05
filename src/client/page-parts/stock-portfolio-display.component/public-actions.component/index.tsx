import { Tooltip } from "@/client/components";
import {
	GetStockDataQueryVariables,
	StockData,
	StockPortfolio as _StockPortfolio
} from "@/client/graphql";
import { Button, ButtonGroup } from "@blueprintjs/core";
import React, { FC, useCallback, useMemo } from "react";

type StockPortfolio = Pick<_StockPortfolio, "id"> & {
	stockData: Pick<StockData, "refreshCost">;
};

interface IProps {
	className?: string;
	onRefresh: (variables: GetStockDataQueryVariables) => void;
	stockPortfolio: StockPortfolio;
}

const useOnRefresh = ({ onRefresh: _onRefresh, stockPortfolio }: IProps) => {
	const variables: GetStockDataQueryVariables = useMemo(
		() => ({ where: { stockPortfolioId: stockPortfolio.id } }),
		[stockPortfolio.id]
	);

	const onRefresh = useCallback(() => _onRefresh(variables), [_onRefresh, variables]);

	return onRefresh;
};

export const PublicActions: FC<IProps> = (props) => {
	const { className, stockPortfolio } = props;

	const refreshCost: number = stockPortfolio.stockData.refreshCost;

	const onRefresh = useOnRefresh(props);

	return (
		<div className={className}>
			<ButtonGroup>
				<Tooltip content={`Costs: ${refreshCost} credits`} position="bottom-left">
					<Button icon="refresh" onClick={onRefresh} text="Refresh" />
				</Tooltip>
			</ButtonGroup>
		</div>
	);
};
