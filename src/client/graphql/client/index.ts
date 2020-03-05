import { resolvers } from "@/client/graphql/resolvers";
import {
	ApolloClient,
	defaultDataIdFromObject,
	InMemoryCache,
	NormalizedCacheObject
} from "apollo-boost";
import { link } from "./links";

export const createCache = (initialState?: NormalizedCacheObject): InMemoryCache => {
	const cache = new InMemoryCache({
		dataIdFromObject: defaultDataIdFromObject
	}).restore(initialState || {});

	if (!initialState?.data) {
		cache.writeData({
			data: {
				modal: false,
				user: null
			}
		});
	}

	return cache;
};

const isDevelopmentMode: boolean = process.env.NODE_ENV === "development";

export const createApolloClient = (
	initialState?: NormalizedCacheObject
): ApolloClient<NormalizedCacheObject> => {
	const isBrowser: boolean = typeof window !== "undefined";
	const connectToDevTools: boolean = isDevelopmentMode;

	const cache: InMemoryCache = createCache(initialState);

	const client = new ApolloClient({
		cache,
		link,
		resolvers,
		...(isBrowser ? { connectToDevTools } : { ssrMode: true })
	});

	return client;
};
