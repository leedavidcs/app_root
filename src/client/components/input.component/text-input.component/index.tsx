import { useFocus } from "@/client/hooks";
import composeRefs from "@seznam/compose-react-refs";
import classnames from "classnames";
import React, {
	CSSProperties,
	FormEvent,
	forwardRef,
	KeyboardEvent,
	MutableRefObject,
	ReactElement,
	useCallback,
	useEffect,
	useRef,
	useState
} from "react";
import { useStyles } from "./styles";

export type TextInputVariant = "underlined" | "outlined";

type InputErrorProp = null | boolean | string;

interface IProps {
	/** Optional classes to pass the outermost `div` */
	className?: string;
	/** Whether the text-input should be disabled */
	disabled?: boolean;
	/**
	 * Error, which will change the label and input style
	 *
	 * @default null
	 */
	error?: InputErrorProp;
	/** Label to be placed on the text input. Acts as a placeholder as well */
	label: string;
	max?: number;
	min?: number;
	/** Name given to the text input (for submitting a form) */
	name?: string;
	/** HTMLInputElement onChange event */
	onChange?: (event: FormEvent<HTMLInputElement>) => void;
	/** HTMLInputElement onKeyDown event */
	onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
	/** Whether this should spellcheck (red-squiggle) */
	spellCheck?: boolean;
	/** Add an icon to the left-side of the text input */
	startIcon?: ReactElement;
	/**
	 * Optional styles to pass to the outermost `div`
	 *
	 * @default null
	 */
	style?: CSSProperties;
	/** Type to assign to the input element */
	type?: "number" | "password" | "text";
	/** Controlled value of the input */
	value?: string;
	/**
	 * Stylistic variations for the element. See story
	 *
	 * @default "underlined"
	 */
	variant?: TextInputVariant;
}

const getErrorMessage = (
	label: string,
	error: null | boolean | string,
	fallback = label
): string => {
	switch (typeof error) {
		case "boolean":
			// Error message is not provided. Use fallback if error
			return error ? fallback : label;
		case "string":
			// Error message is provided (is string). Use error
			return error;
		default:
			// Error is null: There is no error, use label
			return label;
	}
};

const useGetCoalescedValue = (
	inputRef: MutableRefObject<HTMLInputElement | null>,
	fallback?: string
): (() => string | undefined) => () => inputRef.current?.value || fallback;

const useLabelText = ({ error = null, label }: IProps): string => {
	const [labelText, setLabelText] = useState<string>(label);

	useEffect(() => setLabelText(getErrorMessage(label, error)), [error, setLabelText, label]);

	return labelText;
};

const useLabelEffect = (
	{ error = null, type, value, variant = "outlined" }: IProps,
	classes: ReturnType<typeof useStyles>,
	labelRef: MutableRefObject<HTMLDivElement | null>
): MutableRefObject<HTMLInputElement | null> => {
	const inputRef: MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

	const getCoalescedValue = useGetCoalescedValue(inputRef, value);

	const setInputStyles = useCallback(() => {
		const labelDiv: HTMLDivElement | null = labelRef.current;

		if (labelDiv === null) {
			return;
		}

		const coalescedValue: Maybe<string> = getCoalescedValue();

		const isActive = type !== "number" && Boolean(coalescedValue);
		const isEmptyNumber: boolean = type === "number" && !isNaN(parseInt(coalescedValue || ""));

		labelDiv.className = classnames(classes.label, classes[variant], {
			[classes.labelActive]: isActive || isEmptyNumber,
			[classes.invalid]: Boolean(error)
		});
	}, [classes, error, getCoalescedValue, labelRef, type, variant]);

	/**
	 * @description Set styles on prop change
	 */
	useEffect(() => setInputStyles(), [setInputStyles]);

	/**
	 * @description Set styles on uncontrolled value change (this is valuable for react-hook-form)
	 */
	useEffect(() => {
		const input: HTMLInputElement | null = inputRef.current;

		if (input === null) {
			return;
		}

		input.addEventListener("input", setInputStyles);

		return () => input?.removeEventListener("input", setInputStyles);
	}, [setInputStyles]);

	return inputRef;
};

const useRootEffect = (
	{ className, error = null, variant = "underlined" }: IProps,
	classes: ReturnType<typeof useStyles>,
	inputRef: MutableRefObject<HTMLInputElement | null>
): MutableRefObject<HTMLDivElement | null> => {
	const rootRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

	const [isFocused] = useFocus(false, inputRef);

	useEffect(() => {
		const rootDiv: HTMLDivElement | null = rootRef.current;

		if (rootDiv === null) {
			return;
		}

		rootDiv.className = classnames(classes.root, className, classes[variant], {
			[classes.focused]: isFocused,
			[classes.invalid]: Boolean(error)
		});
	}, [classes, className, error, isFocused, rootRef, variant]);

	return rootRef;
};

export const TextInput = forwardRef<HTMLInputElement, IProps>((props, ref) => {
	const {
		className,
		error,
		label,
		startIcon,
		style,
		variant = "underlined",
		...restProps
	} = props;

	const classes = useStyles({ variant });

	const labelRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

	const inputRef = useLabelEffect(props, classes, labelRef);
	const rootRef = useRootEffect(props, classes, inputRef);

	const labelText: string = useLabelText(props);

	return (
		<div ref={rootRef} style={style}>
			{startIcon && <div className={classes.startIconWrapper}>{startIcon}</div>}
			<div className={classes.textInputWrapper}>
				<div ref={labelRef}>{labelText}</div>
				<input
					ref={composeRefs(ref, inputRef)}
					className={classnames(classes.textInput, {
						[classes.invalid]: Boolean(error)
					})}
					{...restProps}
				/>
			</div>
		</div>
	);
});

TextInput.displayName = "TextInput";
