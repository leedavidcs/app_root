import { Modal, ModalContext } from "@/client/components/modal.component";
import { Overlay } from "@/client/components/overlay.component";
import { ToggleModalMutation, useGetModalQuery, useToggleModalMutation } from "@/client/graphql";
import React, { FC, ReactElement, useCallback, useMemo, useState } from "react";

export * from "./modal.context";

interface IContent {
	title: string;
	body: ReactElement;
}

export const ModalProvider: FC = ({ children }) => {
	const { data } = useGetModalQuery();

	const [content, setContent] = useState<IContent | null>(null);

	const onCompleted = useCallback(
		(result: ToggleModalMutation) => {
			const isOff = !result.toggleModal;

			if (isOff) {
				setContent(null);
			}
		},
		[setContent]
	);

	const [toggleModal] = useToggleModalMutation({ onCompleted });

	const { title, body } = content || { title: "", body: null };
	const active: boolean = data?.modal || false;

	const toggle = useCallback(
		(force?: boolean): void => {
			toggleModal({ variables: { force } });
		},
		[toggleModal]
	);

	const onClose = useCallback(() => toggle(false), [toggle]);

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
