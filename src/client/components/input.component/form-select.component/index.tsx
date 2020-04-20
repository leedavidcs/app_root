import { ISelectProps, Select } from "@/client/components/input.component/select.component";
import { Button, FormGroup, Intent } from "@blueprintjs/core";
import { get, toString } from "lodash";
import React, { CSSProperties, FC, memo, ReactElement } from "react";
import { Control, Controller } from "react-hook-form";

interface IBaseSelectProps<T extends any, TOriginal = T>
	extends Omit<ISelectProps<T, TOriginal>, "activeItem" | "children" | "onItemSelect"> {
	onItemSelect?: ISelectProps<T, TOriginal>["onItemSelect"];
}

interface IFormSelectProps<T extends any, TOriginal = T> extends IBaseSelectProps<T, TOriginal> {
	control?: Control<any>;
	defaultValue?: T;
	error?: Maybe<string | ReactElement>;
	inline?: boolean;
	label?: string;
	labelInfo?: string;
	name?: string;
	placeholder?: string;
	style?: CSSProperties;
	value?: T;
}

interface IWithStaticExports {
	ofType: <T extends any, TOriginal = T>() => FC<IFormSelectProps<T, TOriginal>>;
}

const ofType = <T extends any, TOriginal = T>() => {
	const TypedSelect = Select.ofType<T, TOriginal>();

	const BaseComponent: FC<IFormSelectProps<T, TOriginal>> = ({
		className,
		control,
		defaultValue,
		error,
		inline,
		label,
		labelInfo,
		name,
		onItemSelect = () => undefined,
		placeholder,
		style,
		value,
		...props
	}) => {
		const {
			itemMap = {
				to: (item: any) => item,
				from: (item: any) => item
			},
			itemName = (item: TOriginal) => get(item, "key") ?? toString(item)
		} = props;

		const intent: Intent = error ? "danger" : "none";

		const valueText: Maybe<string> = value && itemName(itemMap.to(value));

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
				<TypedSelect activeItem={value} {...props} onItemSelect={onItemSelect}>
					<Button
						intent={intent}
						rightIcon="caret-down"
						text={valueText ?? placeholder ?? "Select a value"}
					/>
				</TypedSelect>
			</FormGroup>
		);
	};

	const component: FC<IFormSelectProps<T, TOriginal>> = memo((props) => {
		const { control, defaultValue, name, value, ...restProps } = props;

		if (control) {
			if (!name) {
				throw new Error("FormSelect is used in a form without a name!");
			}

			return (
				<Controller
					as={BaseComponent}
					control={control}
					defaultValue={defaultValue}
					name={name}
					onChangeName="onItemSelect"
					{...restProps}
				/>
			);
		}

		return <BaseComponent {...restProps} />;
	});

	component.displayName = "TypedFormSelect";

	return component;
};

const _FormSelect: FC<IFormSelectProps<any>> = ofType<any>();
_FormSelect.displayName = "FormSelect";

(_FormSelect as FC<IFormSelectProps<any>> & IWithStaticExports).ofType = ofType;

export const FormSelect = _FormSelect as FC<IFormSelectProps<any>> & IWithStaticExports;
