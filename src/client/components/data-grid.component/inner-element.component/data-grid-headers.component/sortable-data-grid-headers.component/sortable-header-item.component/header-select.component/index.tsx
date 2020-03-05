import { IHeaderOption } from "@/client/components/data-grid.component";
import { List, ListItem, ListItemText } from "@/client/components/list.component";
import React, { FC, useCallback } from "react";
import { useStyles } from "./styles";

interface IProps {
	onSelect: (option: IHeaderOption) => void;
	options: readonly IHeaderOption[] | null;
	value: string;
}

export const HeaderSelect: FC<IProps> = ({ onSelect, options, value: propsValue }) => {
	const classes = useStyles();

	const onClick = useCallback((option: IHeaderOption) => () => onSelect(option), [onSelect]);

	return (
		options && (
			<List className={classes.root}>
				{options.map((option) => {
					const { label, value } = option;

					return (
						<ListItem
							key={value}
							selected={value === propsValue}
							onClick={onClick(option)}
						>
							<ListItemText primary={label} />
						</ListItem>
					);
				})}
			</List>
		)
	);
};
