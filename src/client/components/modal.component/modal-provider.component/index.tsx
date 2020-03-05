import { Modal, ModalContext } from "@/client/components/modal.component";
import { Overlay } from "@/client/components/overlay.component";
import { GetModal, Mutations, Queries, ToggleModal, ToggleModalVariables } from "@/client/graphql";
import React, { FC, ReactElement, useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-apollo";

export * from "./modal.context";

export const ModalProvider: FC = ({ children }) => {
	const { data } = useQuery<GetModal>(Queries.GetModal);
	const [toggleModal] = useMutation<ToggleModal, ToggleModalVariables>(Mutations.ToggleModal);

	const [content, setContent] = useState<{ title: string; body: ReactElement } | null>(null);

	const { title, body } = content || { title: "", body: null };
	const active: boolean = data?.modal || false;

	const toggle = useCallback(
		(force?: boolean): void => {
			toggleModal({ variables: { force } });
		},
		[toggleModal]
	);

	const onClose = useCallback(() => {
		setContent(null);
		toggle(false);
	}, [setContent, toggle]);

	const value = useMemo(() => ({ active, setContent, toggle }), [active, setContent, toggle]);

	return (
		<ModalContext.Provider value={value}>
			{children}
			<Overlay active={active} clickThrough={false} relative={false} />
			<Modal active={active} onClose={onClose} onClickOut={onClose} title={title}>
				{body}
			</Modal>
		</ModalContext.Provider>
	);
};
