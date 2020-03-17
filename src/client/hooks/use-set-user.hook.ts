import {
	GetUserDocument,
	GetUserQuery,
	GetViewerQuery,
	useGetUserQuery,
	useGetViewerLazyQuery,
	useSetUserMutation
} from "@/client/graphql";
import { useCallback, useState } from "react";

type SetUserResultsTuple = [
	() => void,
	{ user: GetUserQuery["user"] | null; called: boolean; loading: boolean }
];

interface IUseSetUserOptions {
	onCompleted?: (user: GetUserQuery["user"] | null) => any;
}

const useLocalUserState = (): GetUserQuery["user"] | null => {
	const { data } = useGetUserQuery();

	const user: GetUserQuery["user"] | null = data ? data.user : null;

	return user;
};

export const useSetUser = (options?: IUseSetUserOptions): SetUserResultsTuple => {
	const { onCompleted: optOnCompleted } = options || {};

	const [called, setCalled] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const user: GetUserQuery["user"] | null = useLocalUserState();

	const onSetUserCompleted = useCallback(() => {
		setLoading(false);

		optOnCompleted?.(user);
	}, [setLoading, optOnCompleted, user]);

	const [setUser] = useSetUserMutation({
		awaitRefetchQueries: true,
		refetchQueries: [{ query: GetUserDocument }],
		onCompleted: onSetUserCompleted
	});

	const onCompleted = useCallback(
		(result: GetViewerQuery) => setUser({ variables: { user: result?.viewer } }),
		[setUser]
	);

	const onError = useCallback(() => setUser({ variables: { user: null } }), [setUser]);

	const [getViewer] = useGetViewerLazyQuery({
		fetchPolicy: "no-cache",
		onCompleted,
		onError
	});

	const outputSetUser = useCallback(() => {
		getViewer();

		setCalled(true);
		setLoading(true);
	}, [setCalled, setLoading, getViewer]);

	return [outputSetUser, { called, loading, user }];
};
