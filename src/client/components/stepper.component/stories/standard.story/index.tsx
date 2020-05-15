import { ButtonGroup } from "@/client/components/button-group.component";
import { Button } from "@/client/components/button.component";
import { Paper } from "@/client/components/paper.component";
import { Stepper } from "@/client/components/stepper.component";
import { range } from "lodash";
import React, { FC, useCallback, useState } from "react";

const NUM_OF_STEPS = 3;

export const StandardStory: FC = () => {
	const [activeStep, setActiveStep] = useState<number>(0);

	const onClickBack = useCallback(() => setActiveStep(Math.max(activeStep - 1, 0)), [activeStep]);
	const onClickNext = useCallback(() => setActiveStep(Math.min(activeStep + 1, NUM_OF_STEPS)), [
		activeStep
	]);

	return (
		<Paper>
			<Stepper activeStep={activeStep}>
				{range(NUM_OF_STEPS).map((_, i) => (
					<Stepper.Step key={i} label={`This is step ${i}`} />
				))}
			</Stepper>
			<ButtonGroup>
				<Button onClick={onClickBack} text="Back" />
				<Button onClick={onClickNext} text="Next" />
			</ButtonGroup>
		</Paper>
	);
};
