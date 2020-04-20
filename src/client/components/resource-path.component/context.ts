import { Context, createContext, ReactText } from "react";

interface IResourcePathContext {
	activePath?: ReactText;
}

export const ResourcePathContext: Context<IResourcePathContext> = createContext<
	IResourcePathContext
>({});

ResourcePathContext.displayName = "ResourcePathContext";
