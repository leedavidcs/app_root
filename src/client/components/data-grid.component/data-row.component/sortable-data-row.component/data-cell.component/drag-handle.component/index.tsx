import { Icon } from "@blueprintjs/core";
import React, { ComponentClass } from "react";
import { SortableHandle } from "react-sortable-hoc";
import { useStyles } from "./styles";

export const DragHandle: ComponentClass<{}> = SortableHandle(() => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Icon icon="drag-handle-vertical" />
		</div>
	);
});
