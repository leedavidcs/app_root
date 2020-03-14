import {
	GetUser,
	GetUser_user as User,
	GetViewer,
	Mutations,
	Queries,
	SetUser,
	SetUserVariables
} from "@/client/graphql";
import { useCallback, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "react-apollo";

type SetUserResultsTuple = [() => void, { user: User | null; called: boolean; loading: boolean }];

interface IUseSetUserOptions {
	onCompleted?: (user: User | null) => any;
}

const useLocalUserState = (): User | null => {
	const { data } = useQuery<GetUser>(Queries.GetUser);

	const user: User | null = data ? data.user : null;

	return user;
};

export const useSetUser = (options?: IUseSetUserOptions): SetUserResultsTuple => {
	const { onCompleted: optOnCompleted } = options || {};

	const [called, setCalled] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const user: User | null = useLocalUserState();

	const onSetUserCompleted = useCallback(() => {
		setLoading(false);

		optOnCompleted?.(user);
	}, [setLoading, optOnCompleted, user]);

	const [setUser] = useMutation<SetUser, SetUserVariables>(Mutations.SetUser, {
		awaitRefetchQueries: true,
		refetchQueries: [{ query: Queries.GetUser }],
		onCompleted: onSetUserCompleted
	});

	const onCompleted = useCallback(
		(result: GetViewer) => setUser({ variables: { user: result?.viewer } }),
		[setUser]
	);

	const onError = useCallback(() => setUser({ variables: { user: null } }), [setUser]);

	const [getViewer] = useLazyQuery<GetViewer>(Queries.GetViewer, {
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
