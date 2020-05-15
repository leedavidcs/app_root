import { ISelectItemType } from "@/client/components/input.component/select.component";
import { Menu } from "@/client/components/menu.component";
import type { IItemRendererProps } from "@blueprintjs/select";
import React, { CSSProperties, ReactElement } from "react";
import Highlighter from "react-highlight-words";
import { useStyles } from "./styles";

export interface IItemProps<T> {
	item: ISelectItemType<T>;
	rendererProps: IItemRendererProps;
	style?: CSSProperties;
}

export const DefaultItemRenderer = <T extends any>({
	item,
	rendererProps,
	style
}: IItemProps<T>): ReactElement => {
	const classes = useStyles();

	const { handleClick, modifiers, query } = rendererProps;

	return (
		<Menu.Item
			key={item.key}
			active={modifiers.active}
			disabled={modifiers.disabled}
			onClick={handleClick}
			style={style}
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
