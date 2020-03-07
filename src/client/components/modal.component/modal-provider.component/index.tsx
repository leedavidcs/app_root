import { Modal, ModalContext } from "@/client/components/modal.component";
import { Overlay } from "@/client/components/overlay.component";
import { GetModal, Mutations, Queries, ToggleModal, ToggleModalVariables } from "@/client/graphql";
import React, { FC, ReactElement, useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-apollo";

export * from "./modal.context";

interface IContent {
	title: string;
	body: ReactElement;
}

export const ModalProvider: FC = ({ children }) => {
	const { data } = useQuery<GetModal>(Queries.GetModal);

	const [content, setContent] = useState<IContent | null>(null);

	const onCompleted = useCallback(
		(result: ToggleModal) => {
			const isOff = !result.toggleModal;

			if (isOff) {
				setContent(null);
			}
		},
		[setContent]
	);

	const [toggleModal] = useMutation<ToggleModal, ToggleModalVariables>(Mutations.ToggleModal, {
		onCompleted
	});

	const { title, body } = content || { title: "", body: null };
	const active: boolean = data?.modal || false;

	const toggle = useCallback(
		(force?: boolean): void => {
			toggleModal({ variables: { force } });
		},
		[toggleModal]
	);

	const onClose = useCallback(() => toggle(false), [toggle]);

	// const setContent2 = useCallback(() => {

	// }, []);

	const value = useMemo(() => ({ active, setContent, toggle }), [active, setContent, toggle]);

	return (
		<ModalContext.Provider value={value}>
			{children}
			<Overlay active={active} clickThrough={false} relative={false} />
			<Modal isOpen={active} onClose={onClose} title={title}>
				{body}
			</Modal>
		</ModalContext.Provider>
	);
};
