import { DataGrid, Paper } from "@/client/components";
import React, { FC } from "react";

export const StockPortfolioDisplay: FC = () => {
	return (
		<Paper>
			<DataGrid data={[]} headers={[]} />
		</Paper>
	);
};
