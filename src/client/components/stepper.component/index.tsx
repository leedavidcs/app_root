import classnames from "classnames";
import React, { FC, memo, ReactElement, ReactNodeArray, useCallback, useMemo } from "react";
import { IStepProps, Step } from "./step.component";
import { useStyles } from "./styles";

interface IProps {
	activeStep: number;
	children: ReactNodeArray;
	className?: string;
	onClickStep?: (step: number) => void;
}

interface IWithStaticProps {
	Step: typeof Step;
}

const isStepElement = (value: any): value is ReactElement<IStepProps> => {
	return React.isValidElement(value) && value.type === Step;
};

const BaseStepper: FC<IProps> = memo(({ activeStep, children, className, onClickStep }) => {
	const classes = useStyles();

	const onClick = useCallback((step: number) => () => onClickStep?.(step), [onClickStep]);

	const steps = useMemo(() => {
		return React.Children.toArray(children).map((step, index) => {
			if (!isStepElement(step)) {
				throw new Error("Stepper contains a non Step element as a child.");
			}

			const isStepActive: boolean = activeStep === index;
			const isStepCompleted: boolean = activeStep > index;

			return React.cloneElement(step, {
				active: isStepActive,
				className: classnames({ [classes.clickable]: Boolean(onClickStep) }),
				completed: isStepCompleted,
				onClick: onClick(index),
				key: index,
				index
			});
		});
	}, [activeStep, children, classes.clickable, onClick, onClickStep]);

	return <div className={classnames(classes.root, className)}>{steps}</div>;
});

BaseStepper.displayName = "Stepper";

(BaseStepper as FC<IProps> & IWithStaticProps).Step = Step;

export const Stepper = BaseStepper as FC<IProps> & IWithStaticProps;
