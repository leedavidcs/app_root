import { Carousel } from "@/client/components/carousel.component";
import { Paper } from "@/client/components/paper.component";
import { Button, ButtonGroup } from "@blueprintjs/core";
import { range } from "lodash";
import React, { FC, useCallback, useState } from "react";

const NUM_OF_SLIDES = 5;

export const StandardStory: FC = () => {
	const [activeSlide, setActiveSlide] = useState<number>(0);

	const onClickBack = useCallback(() => setActiveSlide(Math.max(activeSlide - 1, 0)), [
		activeSlide
	]);
	const onClickNext = useCallback(
		() => setActiveSlide(Math.min(activeSlide + 1, NUM_OF_SLIDES - 1)),
		[activeSlide]
	);

	return (
		<Paper style={{ display: "inline-block" }}>
			<Carousel activeSlide={activeSlide} onChangeSlide={setActiveSlide}>
				{range(NUM_OF_SLIDES).map((_, i) => (
					<Carousel.Slide key={i}>
						<p>Content {i + 1}</p>
					</Carousel.Slide>
				))}
			</Carousel>
			<ButtonGroup>
				<Button onClick={onClickBack} text="back" />
				<Button onClick={onClickNext} text="next" />
			</ButtonGroup>
		</Paper>
	);
};
