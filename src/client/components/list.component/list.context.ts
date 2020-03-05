import { DividerVariant } from "@/client/components/divider.component";
import { Context, createContext } from "react";

interface IListContext {
	divider: DividerVariant | null;
}

export const ListContext: Context<IListContext> = createContext<IListContext>({
	divider: null
});

ListContext.displayName = "ListContext";
