import { IClientContext } from "@/client/graphql";
import { Toast, ToastInput } from "@/client/graphql/generated";
import { IClientState } from "@/client/graphql/state";
import { gql } from "@apollo/client";

const setToasts: LocalResolver<any, IClientContext, { toasts: readonly ToastInput[] }> = (
	parent,
	{ toasts: _toasts },
	{ cache }
) => {
	const toasts: readonly Toast[] = _toasts.map((toast) => ({ ...toast, __typename: "Toast" }));

	const data: Partial<IClientState> = { toasts };

	const query = gql`
		query {
			toasts {
				intent
				message
			}
		}
	`;

	cache.writeQuery({ query, data });

	return toasts;
};

export const ToastMutations = { setToasts };
