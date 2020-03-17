import { GetModalQuery, IClientContext } from "@/client/graphql";
import * as Queries from "@/client/graphql/queries";

const toggleModal: LocalResolver<any, IClientContext, { force?: boolean }> = (
	parent,
	{ force },
	{ cache }
) => {
	const query = Queries.GetModal;

	const previous = cache.readQuery<GetModalQuery, {}>({ query });

	// prettier-ignore
	const modal: boolean =
		typeof force === "boolean" ? force
		: previous                 ? !previous.modal
								   : false;

	cache.writeQuery({ query, data: { modal } });

	return modal;
};

export const ModalMutations = { toggleModal };
