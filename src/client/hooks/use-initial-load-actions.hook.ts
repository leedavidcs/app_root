import {
	GetInitialAppLoadQuery,
	useGetInitialAppLoadQuery,
	useSetToastsMutation
} from "@/client/graphql";
import type { Intent } from "@blueprintjs/core";
import { useCallback, useRef } from "react";
import { useToast } from "./use-toast.hook";

export const useInitialLoadActions = () => {
	const isFirstLoadRef = useRef<boolean>(true);

	const toaster = useToast();

	const [setToasts] = useSetToastsMutation();

	const displayToasts = useCallback(
		(toasts: GetInitialAppLoadQuery["toasts"]) => {
			toasts.forEach(({ intent: _intent, message }) => {
				const intent = (_intent ?? "none") as Intent;

				return toaster.show({ intent, message });
			});

			return setToasts({ variables: { toasts: [] } });
		},
		[setToasts, toaster]
	);

	useGetInitialAppLoadQuery({
		skip: !isFirstLoadRef.current,
		onCompleted: (result) => {
			isFirstLoadRef.current = false;

			const { toasts } = result;

			displayToasts(toasts);
		}
	});
};
