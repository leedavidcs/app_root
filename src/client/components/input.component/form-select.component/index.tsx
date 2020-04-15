import {
	ISelectItemType,
	ISelectProps,
	Select
} from "@/client/components/input.component/select.component";
import { Button, FormGroup, Intent } from "@blueprintjs/core";
import React, { CSSProperties, FC, memo, ReactElement } from "react";
import { Control, Controller } from "react-hook-form";

interface IBaseSelectProps<T extends ISelectItemType>
	extends Omit<ISelectProps<T>, "children" | "onItemSelect"> {
	onItemSelect?: ISelectProps<T>["onItemSelect"];
}

interface IFormSelectProps<T extends ISelectItemType> extends IBaseSelectProps<T> {
	control?: Control;
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
	ofType: <T extends ISelectItemType>() => FC<IFormSelectProps<T>>;
}

const ofType = <T extends ISelectItemType>() => {
	const TypedSelect = Select.ofType<T>();

	const BaseComponent: FC<IFormSelectProps<T>> = ({
		className,
		control,
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
		const intent: Intent = error ? "danger" : "none";

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
				<TypedSelect {...props} onItemSelect={onItemSelect}>
					<Button intent={intent} text={value?.key ?? placeholder ?? "Select a value"} />
				</TypedSelect>
			</FormGroup>
		);
	};

	const component: FC<IFormSelectProps<T>> = memo((props) => {
		const { control, name, value, ...restProps } = props;

		if (control) {
			if (!name) {
				throw new Error("FormSelect is used in a form without a name!");
			}

			return (
				<Controller
					as={BaseComponent}
					control={control}
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
