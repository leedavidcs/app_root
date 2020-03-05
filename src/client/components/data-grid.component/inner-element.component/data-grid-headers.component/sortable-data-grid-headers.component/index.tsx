import { IHeaderConfig, ScrollContext } from "@/client/components/data-grid.component";
import classnames from "classnames";
import { takeRightWhile, takeWhile } from "lodash";
import React, { ReactElement, useCallback, useContext, useMemo } from "react";
import { SortableContainer } from "react-sortable-hoc";
import { SortableHeaderItem } from "./sortable-header-item.component";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	headers: readonly IHeaderConfig[];
}

export const SortableDataGridHeaders = SortableContainer<IProps>((props: IProps) => {
	const { className = "", headers } = props;

	const { xOffset } = useContext(ScrollContext);

	const classes = useStyles({ xOffset });

	const createHeaderItems = useCallback((configs: readonly IHeaderConfig[], offset = 0) => {
		return configs.map((header, i) => {
			const { frozen, value } = header;
			const adjIndex: number = i + offset;

			return (
				<SortableHeaderItem
					key={value}
					{...header}
					headerIndex={adjIndex}
					index={adjIndex}
					disabled={frozen}
				/>
			);
		});
	}, []);

	const frozenHeaders: readonly ReactElement[] = useMemo(
		() => createHeaderItems(takeWhile(headers, { frozen: true })),
		[createHeaderItems, headers]
	);

	const unfrozenHeaders: readonly ReactElement[] = useMemo(
		() => createHeaderItems(takeRightWhile(headers, { frozen: false }), frozenHeaders.length),
		[createHeaderItems, headers, frozenHeaders.length]
	);

	return (
		<div className={classnames(classes.root, className)}>
			<div className={classes.frozenPanel}>{frozenHeaders}</div>
			{unfrozenHeaders}
		</div>
	);
});
