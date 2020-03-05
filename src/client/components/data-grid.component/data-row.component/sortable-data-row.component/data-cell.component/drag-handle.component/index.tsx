import React, { ComponentClass } from "react";
import { GoGrabber } from "react-icons/go";
import { SortableHandle } from "react-sortable-hoc";
import { useStyles } from "./styles";

export const DragHandle: ComponentClass<{}> = SortableHandle(() => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<GoGrabber />
		</div>
	);
});
