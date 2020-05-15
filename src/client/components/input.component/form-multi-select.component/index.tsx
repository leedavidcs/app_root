import { FormGroup } from "@/client/components/input.component/form-group.component";
import {
	IMultiSelectProps,
	MultiSelect
} from "@/client/components/input.component/multi-select.component";
import type { Intent } from "@blueprintjs/core";
import React, { CSSProperties, FC, memo, ReactElement, useCallback } from "react";
import { Control, Controller } from "react-hook-form";

type IBaseSelectProps<T extends any, TOriginal = T> = Omit<
	IMultiSelectProps<T, TOriginal>,
	"onItemRemove" | "onItemsClear" | "onItemSelect" | "selectedItems"
>;

interface IFormMultiSelectProps<T extends any, TOriginal = T>
	extends IBaseSelectProps<T, TOriginal> {
	control?: Control<any>;
	defaultValue?: readonly T[];
	error?: Maybe<string | ReactElement>;
	inline?: boolean;
	itemsEqual?: (itemA: T, itemB: T) => boolean;
	label?: string;
	labelInfo?: string;
	name?: string;
	onChange?: (items: readonly T[]) => void;
	style?: CSSProperties;
	transform?: (items: readonly T[]) => readonly T[];
	value?: readonly T[];
}

interface IWithStaticExports {
	ofType: <T extends any, TOriginal = T>() => FC<IFormMultiSelectProps<T, TOriginal>>;
}

const ofType = <T extends any, TOriginal = T>() => {
	const TypedMultiSelect = MultiSelect.ofType<T, TOriginal>();

	const BaseComponent: FC<IFormMultiSelectProps<T, TOriginal>> = ({
		className,
		control,
		defaultValue,
		error,
		inline,
		itemsEqual = (itemA, itemB) => itemA === itemB,
		label,
		labelInfo,
		name,
		onChange,
		style,
		transform = (items: readonly T[]) => items,
		value,
		...props
	}) => {
		const intent: Intent = error ? "danger" : "none";

		const onItemRemove = useCallback(
			(items: readonly T[]) => onChange?.(transform([...items])),
			[onChange, transform]
		);

		const onItemsClear = useCallback(() => onChange?.(transform([])), [onChange, transform]);

		const onItemSelect = useCallback(
			(item: T) => {
				const oldList = value ?? [];

				if (oldList.findIndex((selectedItem) => itemsEqual(selectedItem, item)) !== -1) {
					const withRemoved = oldList.filter((selected) => !itemsEqual(selected, item));

					onChange?.(transform(withRemoved));

					return;
				}

				const withNew = [...oldList, item];

				onChange?.(transform(withNew));
			},
			[itemsEqual, onChange, transform, value]
		);

		return (
			<FormGroup
				className={className}
				disabled={props.disabled}
				helperText={error}
				inline={inline}
				intent={intent}
				label={label}
				labelInfo={labelInfo}
				style={style}
			>
				<TypedMultiSelect
					{...props}
					onItemRemove={onItemRemove}
					onItemsClear={onItemsClear}
					onItemSelect={onItemSelect}
					selectedItems={value}
				/>
			</FormGroup>
		);
	};

	const component: FC<IFormMultiSelectProps<T, TOriginal>> = memo((props) => {
		const { control, defaultValue, name, onChange, value, ...restProps } = props;

		if (control) {
			if (!name) {
				throw new Error("FormMultiSelect is used in a form without a name!");
			}

			return (
				<Controller
					as={BaseComponent}
					control={control}
					defaultValue={defaultValue}
					name={name}
					{...restProps}
				/>
			);
		}

		return <BaseComponent {...restProps} />;
	});

	component.displayName = "TypedFormMultiSelect";

	return component;
};

const _FormMultiSelect: FC<IFormMultiSelectProps<any>> = ofType<any>();
_FormMultiSelect.displayName = "FormMultiSelect";

(_FormMultiSelect as FC<IFormMultiSelectProps<any>> & IWithStaticExports).ofType = ofType;

export const FormMultiSelect = _FormMultiSelect as FC<IFormMultiSelectProps<any>> &
	IWithStaticExports;
