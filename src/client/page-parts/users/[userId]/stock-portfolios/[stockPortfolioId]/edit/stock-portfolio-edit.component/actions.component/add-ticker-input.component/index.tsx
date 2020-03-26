import { TextInput } from "@/client/components";
import { useKeyDown } from "@/client/hooks";
import { onInputValueChanged } from "@/client/utils";
import { Button } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, useCallback, useState } from "react";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	onAddTicker: (ticker: string) => void;
}

export const AddTickerInput: FC<IProps> = ({ className, onAddTicker }) => {
	const classes = useStyles();

	const [newTicker, setNewTicker] = useState<string>("");

	const onAddTickerChange = useCallback(
		onInputValueChanged((value) => setNewTicker(value)),
		[]
	);

	const onAddTickerSubmit = useCallback(() => {
		onAddTicker?.(newTicker);
		setNewTicker("");
	}, [newTicker, onAddTicker]);

	const onAddBtnEnterKey = useKeyDown("enter", onAddTickerSubmit);

	return (
		<TextInput
			className={classnames(classes.root, className)}
			onChange={onAddTickerChange}
			onKeyDown={onAddBtnEnterKey}
			placeholder="Add ticker"
			value={newTicker}
		>
			<Button icon="plus" onClick={onAddTickerSubmit} />
		</TextInput>
	);
};
