import { Paper } from "@/client/components/paper.component";
import Faker from "faker";
import React from "react";

Faker.seed(1);

const heading: string = Faker.lorem.word();
const paragraph: string = Faker.lorem.paragraph();

export const StandardStory = () => {
	return (
		<Paper>
			<h1>{heading}</h1>
			<p>{paragraph}</p>
		</Paper>
	);
};
