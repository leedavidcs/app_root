import { ISelectItemType } from "@/client/components/input.component/select.component";
import { Menu } from "@blueprintjs/core";
import { IItemRendererProps } from "@blueprintjs/select";
import React, { ReactElement } from "react";
import Highlighter from "react-highlight-words";
import { useStyles } from "./styles";

export interface IItemProps<T> {
	item: ISelectItemType<T>;
	rendererProps: IItemRendererProps;
}

export const DefaultItemRenderer = <T extends any>({
	item,
	rendererProps
}: IItemProps<T>): ReactElement => {
	const classes = useStyles();

	const { handleClick, modifiers, query } = rendererProps;

	return (
		<Menu.Item
			key={item.key}
			active={modifiers.active}
			disabled={modifiers.disabled}
			onClick={handleClick}
			text={
				<div>
					<Highlighter
						autoEscape={true}
						highlightTag={({ children }) => <strong>{children}</strong>}
						searchWords={[query]}
						textToHighlight={item.name.toString()}
					/>
					<div className={classes.info}>{item.info}</div>
				</div>
			}
		/>
	);
};
