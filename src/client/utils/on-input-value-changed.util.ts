import { FormEvent } from "react";

export const onInputValueChanged = (callback: (value: string) => void) => {
	return ({ currentTarget: { value } }: FormEvent<HTMLInputElement>): void => {
		callback(value);
	};
};
