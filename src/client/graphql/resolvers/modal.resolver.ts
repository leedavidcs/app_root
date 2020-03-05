import * as Queries from "@/client/graphql/queries";
import { GetModal, IClientContext } from "@/client/graphql/types";

const toggleModal: LocalResolver<any, IClientContext, { force?: boolean }> = (
	parent,
	{ force },
	{ cache }
) => {
	const query = Queries.GetModal;

	const previous = cache.readQuery<GetModal, {}>({ query });

	// prettier-ignore
	const modal: boolean =
		typeof force === "boolean" ? force
		: previous                 ? !previous.modal
								   : false;

	cache.writeQuery({ query, data: { modal } });

	return modal;
};

export const ModalMutations = { toggleModal };
