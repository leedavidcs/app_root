import type { Intent } from "@blueprintjs/core";
import { Spinner as BpSpinner } from "@blueprintjs/core";
import React, { FC } from "react";

interface IProps {
	className?: string;
	intent?: Intent;
	size?: number;
	tagName?: keyof JSX.IntrinsicElements;
	value?: number;
}

export const Spinner: FC<IProps> = ({ className, intent, size, tagName, value }) => {
	return (
		<BpSpinner
			className={className}
			intent={intent}
			size={size}
			tagName={tagName}
			value={value}
		/>
	);
};
