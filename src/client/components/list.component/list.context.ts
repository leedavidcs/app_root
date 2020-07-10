import { DividerVariant } from "@/client/components/divider.component";
import { Context, createContext, ReactText } from "react";

interface IListContext {
	divider: DividerVariant | null;
	selectedItem?: ReactText;
}

export const ListContext: Context<IListContext> = createContext<IListContext>({
	divider: null
});

ListContext.displayName = "ListContext";
