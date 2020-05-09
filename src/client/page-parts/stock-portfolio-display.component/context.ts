import { Snapshot as _Snapshot } from "@/client/graphql/generated";
import { Context, createContext } from "react";

type Snapshot = Pick<_Snapshot, "id" | "createdAt" | "data" | "headers" | "tickers">;

interface IContextValues {
	setSnapshot?: (snapshot: Snapshot | null) => void;
	snapshot?: Snapshot | null;
}

export const StockPortfolioDisplayContext: Context<IContextValues> = createContext<IContextValues>(
	{}
);

StockPortfolioDisplayContext.displayName = "StockPortfolioDisplayContext";
