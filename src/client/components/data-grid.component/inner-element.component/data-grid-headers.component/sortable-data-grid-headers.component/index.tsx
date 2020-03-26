import { ClickOutside } from "@/client/components/click-outside.component";
import { IHeaderConfig, ScrollContext } from "@/client/components/data-grid.component";
import classnames from "classnames";
import { takeRightWhile, takeWhile } from "lodash";
import React, { memo, ReactElement, useCallback, useContext, useMemo } from "react";
import { SortableContainer } from "react-sortable-hoc";
import { SortableHeaderItem } from "./sortable-header-item.component";
import { useStyles } from "./styles";
import { useOnEditHeader } from "./use-on-edit-header.hook";

export * from "./sortable-header-item.component";

interface IProps {
	className?: string;
	headers: readonly IHeaderConfig[];
}

export const SortableDataGridHeaders = SortableContainer<IProps>(
	memo((props: IProps) => {
		const { className = "", headers } = props;

		const { xOffset } = useContext(ScrollContext);

		const classes = useStyles({ xOffset });

		const [editStates, editActions] = useOnEditHeader();

		const createHeaderItems = useCallback(
			(configs: readonly IHeaderConfig[], offset = 0) => {
				return configs.map((header, i) => {
					const { frozen, value } = header;
					const adjIndex: number = i + offset; /* Adjusted index, for unfrozen headers */

					const isEditingLabel: boolean = adjIndex === editStates.header;

					return isEditingLabel ? (
						<input
							key={value}
							className={classes.labelInput}
							value={editStates.label}
							autoFocus={true}
							onChange={editActions.onChange}
							onKeyDown={editActions.onKeyDown}
							spellCheck={false}
							style={{ width: editStates.width }}
						/>
					) : (
						<SortableHeaderItem
							key={value}
							{...header}
							headerIndex={adjIndex}
							index={adjIndex}
							disabled={frozen}
							onOpenMenu={editActions.onStop}
							onOpenOptions={editActions.onStop}
							onEdit={editActions.onEdit}
						/>
					);
				});
			},
			[
				classes.labelInput,
				editActions.onChange,
				editActions.onEdit,
				editActions.onKeyDown,
				editActions.onStop,
				editStates.header,
				editStates.label,
				editStates.width
			]
		);

		const frozenHeaders: readonly ReactElement[] = useMemo(
			() => createHeaderItems(takeWhile(headers, { frozen: true })),
			[createHeaderItems, headers]
		);

		const unfrozenHeaders: readonly ReactElement[] = useMemo(
			() =>
				createHeaderItems(takeRightWhile(headers, { frozen: false }), frozenHeaders.length),
			[createHeaderItems, headers, frozenHeaders.length]
		);

		return (
			<ClickOutside onClick={editActions.onStop}>
				<div className={classnames(classes.root, className)}>
					<div className={classes.frozenPanel}>{frozenHeaders}</div>
					{unfrozenHeaders}
				</div>
			</ClickOutside>
		);
	})
);

SortableDataGridHeaders.displayName = "SortableDataGridHeaders";
