import { IHeaderConfig } from "@/client/components/data-grid.component";
import React, { FC, memo, MouseEvent } from "react";
import { ResizeHandle } from "./resize-handle.component";
import { useStyles } from "./styles";

interface IProps extends IHeaderConfig {
	index: number;
	onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export const HeaderItem: FC<IProps> = memo(
	({ label, resizable, index, onClick = () => undefined }) => {
		const classes = useStyles();

		return (
			<div className={classes.root} onClick={onClick}>
				<div className={classes.content}>{label}</div>
				{resizable ? <ResizeHandle index={index} /> : null}
			</div>
		);
	}
);

HeaderItem.displayName = "HeaderItem";
