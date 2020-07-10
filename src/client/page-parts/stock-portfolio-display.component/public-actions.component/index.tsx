import { Button, ButtonGroup, Tooltip } from "@/client/components";
import { StockData, StockPortfolio as _StockPortfolio } from "@/client/graphql";
import { SnapshotLookup } from "@/client/page-parts/snapshot-lookup.component";
import { StockPortfolioDisplayContext } from "@/client/page-parts/stock-portfolio-display.component/context";
import React, { FC, useCallback, useContext } from "react";
import { useStyles } from "./styles";

type StockPortfolio = Pick<_StockPortfolio, "id"> & {
	stockData: Pick<StockData, "refreshCost">;
};

interface IProps {
	className?: string;
	onRefresh: () => void;
	stockPortfolio: StockPortfolio;
}

export const PublicActions: FC<IProps> = ({ className, onRefresh, stockPortfolio }) => {
	const classes = useStyles();

	const { snapshot, setSnapshot } = useContext(StockPortfolioDisplayContext);

	const refreshCost: number = stockPortfolio.stockData.refreshCost;

	const onReturn = useCallback(() => setSnapshot?.(null), [setSnapshot]);

	return (
		<ButtonGroup className={className}>
			{snapshot ? (
				<Button icon="arrow-left" onClick={onReturn} text="Return" />
			) : (
				<Tooltip
					className={classes.tooltip}
					content={`Costs: ${refreshCost} credits`}
					position="bottom-left"
				>
					<Button icon="refresh" onClick={onRefresh} text="Refresh" />
				</Tooltip>
			)}
			<SnapshotLookup
				onChange={setSnapshot}
				selected={snapshot}
				stockPortfolioId={stockPortfolio.id}
			/>
		</ButtonGroup>
	);
};
