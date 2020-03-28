import { GetOneStockPortfolioQuery, GetStockDataQueryVariables } from "@/client/graphql";
import { Button, ButtonGroup } from "@blueprintjs/core";
import React, { FC, useCallback, useMemo } from "react";

interface IProps {
	className?: string;
	onRefresh: (variables: GetStockDataQueryVariables) => void;
	stockPortfolio: NonNullable<GetOneStockPortfolioQuery["stockPortfolio"]>;
}

const useOnRefresh = ({ onRefresh: _onRefresh, stockPortfolio }: IProps) => {
	const { headers, tickers } = stockPortfolio;

	const dataKeys: readonly string[] = headers.map(({ dataKey }) => dataKey);

	const variables: GetStockDataQueryVariables = useMemo(() => ({ dataKeys, tickers }), [
		dataKeys,
		tickers
	]);

	const onRefresh = useCallback(() => _onRefresh(variables), [_onRefresh, variables]);

	return onRefresh;
};

export const PublicActions: FC<IProps> = (props) => {
	const { className } = props;

	const onRefresh = useOnRefresh(props);

	return (
		<ButtonGroup className={className}>
			<Button icon="refresh" onClick={onRefresh} text="Refresh" />
		</ButtonGroup>
	);
};
