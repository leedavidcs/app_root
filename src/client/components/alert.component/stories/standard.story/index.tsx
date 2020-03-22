import { Alert } from "@/client/components/alert.component";
import { Button } from "@blueprintjs/core";
import React, { FC, useCallback, useState } from "react";

export const StandardStory: FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onOpen = useCallback(() => setIsOpen(true), [setIsOpen]);
	const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);

	return (
		<div>
			<Button onClick={onOpen} text="Open alert" />
			<Alert
				cancelButtonText="Cancel"
				confirmButtonText="Delete"
				icon="trash"
				intent="danger"
				isOpen={isOpen}
				onClose={onClose}
			>
				<p>I am an alert. And I am open.</p>
			</Alert>
		</div>
	);
};
