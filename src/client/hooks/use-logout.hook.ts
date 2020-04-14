import { GetUserDocument, useSetUserMutation } from "@/client/graphql";
import { logout as _logout } from "@/server/authentication/cookie-utils";
import { NextRouter, useRouter } from "next/router";
import { useCallback } from "react";

export const useLogout = (): [() => void] => {
	const router: NextRouter = useRouter();
	const [setUser] = useSetUserMutation({
		awaitRefetchQueries: true,
		refetchQueries: [{ query: GetUserDocument }]
	});

	const logout = useCallback(() => {
		_logout();
		setUser();
		router.push("/");
	}, [router, setUser]);

	return [logout];
};
