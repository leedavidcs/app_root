import { Snapshot as _Snapshot } from "@/client/graphql/generated";
import { Context, createContext } from "react";

type Snapshot = Pick<_Snapshot, "id" | "createdAt">;

interface IContextValues {
	setSnapshot?: (snapshot: Maybe<Snapshot>) => void;
	snapshot?: Maybe<Snapshot>;
}

export const StockPortfolioDisplayContext: Context<IContextValues> = createContext<IContextValues>(
	{}
);

StockPortfolioDisplayContext.displayName = "StockPortfolioDisplayContext";
