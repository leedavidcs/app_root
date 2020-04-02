import classnames from "classnames";
import React, { Children, FC, ReactElement, ReactNode, useMemo } from "react";
import { IStepProps, Step } from "./step.component";
import { useStyles } from "./styles";

interface IProps {
	activeStep: number;
	children: ReactNode;
	className?: string;
}

interface IWithStaticProps {
	Step: typeof Step;
}

const isStepElement = (value: any): value is ReactElement<IStepProps> => {
	return React.isValidElement(value) && value.type === Step;
};

const BaseStepper: FC<IProps> = ({ activeStep, children, className }) => {
	const classes = useStyles();

	const steps = useMemo(() => {
		return Children.toArray(children).map((step, index) => {
			if (!isStepElement(step)) {
				throw new Error("Stepper contains a non Step element as a child.");
			}

			const isStepActive: boolean = activeStep === index;
			const isStepCompleted: boolean = activeStep > index;

			return React.cloneElement(step, {
				active: isStepActive,
				completed: isStepCompleted,
				key: index,
				index
			});
		});
	}, [activeStep, children]);

	return <div className={classnames(classes.root, className)}>{steps}</div>;
};

(BaseStepper as FC<IProps> & IWithStaticProps).Step = Step;

export const Stepper = BaseStepper as FC<IProps> & IWithStaticProps;
