import { Modal } from "@/client/components/modal.component";
import { Button } from "@blueprintjs/core/lib/esm";
import { text } from "@storybook/addon-knobs";
import Faker from "faker";
import React, { FC, useCallback, useState } from "react";

Faker.seed(1);

const PARAGRAPHS_COUNT = 5;

const paragraphs: string = Faker.lorem.paragraphs(PARAGRAPHS_COUNT);

export const StandardStory: FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onOpen = useCallback(() => setIsOpen(true), [setIsOpen]);
	const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);

	return (
		<div>
			<Button text="Open modal" onClick={onOpen} />
			<Modal
				title={text("title", "Hello world!")}
				isOpen={isOpen}
				onClose={onClose}
				footer={[
					<Button key="close" text="close" onClick={onClose} />,
					<Button key="doThing" intent="primary" text="Do the thing" />
				]}
			>
				<p>{text("content", paragraphs)}</p>
			</Modal>
		</div>
	);
};
