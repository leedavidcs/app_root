import { IHeaderConfig } from "@/client/components/data-grid.component";
import React, { FC, MouseEvent } from "react";
import { ResizeHandle } from "./resize-handle.component";
import { useStyles } from "./styles";

interface IProps extends IHeaderConfig {
	index: number;
	onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export const HeaderItem: FC<IProps> = ({
	frozen,
	label,
	resizable,
	index,
	onClick = () => undefined
}) => {
	const classes = useStyles({ frozen });

	return (
		<div className={classes.root} onClick={onClick}>
			<div className={classes.content}>{label}</div>
			{resizable ? <ResizeHandle index={index} /> : null}
		</div>
	);
};
