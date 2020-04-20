import { Divider } from "@/client/components/divider.component";
import { ListContext } from "@/client/components/list.component";
import { Overlay } from "@/client/components/overlay.component";
import { Ripple } from "@/client/components/ripple.component";
import { useHover, useIsLastChild } from "@/client/hooks";
import { Classes, Icon, IconName, Text } from "@blueprintjs/core";
import classnames from "classnames";
import Link from "next/link";
import React, {
	FC,
	Fragment,
	memo,
	MouseEvent,
	ReactNode,
	ReactText,
	useContext,
	useRef
} from "react";
import { useStyles } from "./styles";

const OVERLAY_HOVER_OPACITY = 0.04;
const OVERLAY_FOCUS_OPACITY = 0.1;

export interface IListItemProps {
	/**
	 * The ReactNode to place within the `li`. If a render function is passed instead, this will
	 * expose a React.FC with a props of `{ deferred: (element: ReactElement) => ReactElement; }`
	 * that will defer the ListItem behaviors to the deferred element (see story `AccordionStory`
	 * of `general/expansion-panel`)
	 */
	children?: ReactNode;
	/** Optional classes to pass to the wrapping div of the list item */
	className?: string;
	/** Href, if this list item should act as a link */
	href?: string;
	/** Icon to be prepended to the list item */
	icon?: IconName;
	/** ID to be used to determine selection if set by the parent `List` component */
	id?: ReactText;
	/** Info to be appended after the `text` property */
	info?: ReactNode;
	/**
	 * Click handler.
	 */
	onClick?: (event: MouseEvent<HTMLElement>) => void;
	/**
	 * Applies a ripple effect if the element is selectable
	 *
	 * @default true
	 */
	ripple?: boolean;
	/**
	 * Whether this item is selected or not. If this is provided, the list will behave as if it is
	 * selectable (highlights on hover, ripples on click)
	 */
	selected?: boolean;
	/** Text to be displayed */
	text?: ReactNode;
}

export const ListItem: FC<IListItemProps> = memo(
	({
		children,
		className,
		href,
		icon,
		id = href ?? "",
		info,
		onClick,
		ripple,
		selected,
		text
	}) => {
		const classes = useStyles();

		const ref = useRef<HTMLLIElement>(null);

		const [hovered] = useHover<HTMLLIElement>(false, {}, ref);

		const { divider, selectedItem } = useContext(ListContext);

		const [isLastItem] = useIsLastChild(ref);

		const opacity: number = selected ? OVERLAY_FOCUS_OPACITY : OVERLAY_HOVER_OPACITY;
		const isInteractable = Boolean(onClick ?? href);
		const isSelected: boolean = selected ?? selectedItem === id;

		const TagType = href ? "a" : "span";

		return (
			<li className={classnames(classes.root, className)} onClick={onClick} ref={ref}>
				{React.createElement<any>(
					href ? Link : Fragment,
					href ? { href } : {},
					<TagType className={classes.link}>
						{icon && <Icon icon={icon} />}
						<div className={classes.textWrapper}>
							<Text className={Classes.FILL} ellipsize={true}>
								{text}
							</Text>
							{info && <div className={classes.info}>{info}</div>}
						</div>
						{children}
					</TagType>
				)}
				<Overlay
					active={isInteractable && (hovered || isSelected)}
					clickThrough={true}
					opacity={opacity}
				/>
				{isInteractable && ripple && <Ripple />}
				{divider && !isLastItem && (
					<Divider className={classes.divider} variant={divider} />
				)}
			</li>
		);
	}
);

ListItem.displayName = "ListItem";
