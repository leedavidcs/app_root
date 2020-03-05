import { ExpansionPanel } from "@/client/components/expansion-panel.component";
import { Paper } from "@/client/components/paper.component";
import Faker from "faker";
import React, { useCallback, useState } from "react";
import { useStyles } from "./styles";

const PARAGRAPH_COUNT = 10;

Faker.seed(1);

const content: string = Faker.lorem.paragraphs(PARAGRAPH_COUNT);

export const StandardStory = () => {
	const classes = useStyles();

	const [active, setActive] = useState<boolean>(false);

	const onClick = useCallback(() => setActive(!active), [active, setActive]);

	return (
		<Paper>
			<ExpansionPanel
				active={active}
				header={
					<div className={classes.header} onClick={onClick}>
						Header Item
					</div>
				}
			>
				<p className={classes.content}>{content}</p>
			</ExpansionPanel>
		</Paper>
	);
};
