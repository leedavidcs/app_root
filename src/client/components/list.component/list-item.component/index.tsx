import { Divider } from "@/client/components/divider.component";
import { ListContext } from "@/client/components/list.component";
import { Overlay } from "@/client/components/overlay.component";
import { Ripple } from "@/client/components/ripple.component";
import { useHover, useIsLastChild } from "@/client/hooks";
import classnames from "classnames";
import { flow } from "lodash";
import memoizeOne from "memoize-one";
import Link from "next/link";
import React, {
	FC,
	Fragment,
	MouseEvent,
	MutableRefObject,
	ReactElement,
	ReactNode,
	useCallback,
	useContext,
	useMemo
} from "react";
import { useStyles } from "./styles";

export * from "./list-item-icon.component";
export * from "./list-item-text.component";

const OVERLAY_HOVER_OPACITY = 0.04;
const OVERLAY_FOCUS_OPACITY = 0.1;

interface IChildrenProps {
	deferred: (element: ReactElement) => ReactElement;
}

interface IProps {
	/**
	 * The ReactNode to place within the `li`. If a render function is passed instead, this will
	 * expose a React.FC with a props of `{ deferred: (element: ReactElement) => ReactElement; }`
	 * that will defer the ListItem behaviors to the deferred element (see story `AccordionStory`
	 * of `general/expansion-panel`)
	 */
	children: ReactNode | FC<IChildrenProps>;
	/** Optional classes to pass to the wrapping div of the list item */
	className?: string;
	/** Href, if this list item should act as a link */
	href?: string;
	/**
	 * Click handler. This will target a `li` if {children} is a ReactNode. `div` if {children} is a
	 * function
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
}

const isDeferred = memoizeOne((value: any): value is FC<IChildrenProps> => {
	return typeof value === "function";
});

const useWithHref = ({ href }: IProps, classes: ReturnType<typeof useStyles>) => {
	return useCallback(
		(content: ReactNode) => {
			if (!href) {
				return content;
			}

			return (
				<Link href={href}>
					<a className={classes.link}>{content}</a>
				</Link>
			);
		},
		[classes, href]
	);
};

const useWithEffects = ({
	href,
	ripple = true,
	selected
}: IProps): [MutableRefObject<HTMLLIElement | null>, (element: ReactNode) => ReactElement] => {
	const [hovered, listItemRef] = useHover<HTMLLIElement>(false);

	const isSelectable: boolean = typeof selected === "boolean" || typeof href === "string";

	const overlayElem: ReactElement = useMemo(() => {
		const opacity: number = selected ? OVERLAY_FOCUS_OPACITY : OVERLAY_HOVER_OPACITY;

		return (
			<Overlay
				active={isSelectable && (hovered || selected)}
				clickThrough={true}
				opacity={opacity}
			/>
		);
	}, [isSelectable, hovered, selected]);

	return [
		listItemRef,
		useCallback(
			(element: ReactNode) => (
				<Fragment>
					{element}
					{overlayElem}
					{isSelectable && ripple && <Ripple />}
				</Fragment>
			),
			[isSelectable, overlayElem, ripple]
		)
	];
};

const useHandlers = ({ children, onClick }: IProps) => {
	return useMemo(() => {
		const handlers = { onClick };

		return isDeferred(children) ? [handlers, {}] : [{}, handlers];
	}, [children, onClick]);
};

const useChildElement = (
	{ children, className }: IProps,
	decorateItem: (content: ReactNode) => ReactElement,
	handlers: Record<string, any>,
	classes: ReturnType<typeof useStyles>
) => {
	const getDeferredElement = useCallback(
		(element: ReactElement) => (
			<div className={classnames(classes.root, classes.padded, className)} {...handlers}>
				{decorateItem(element)}
			</div>
		),
		[className, decorateItem, handlers, classes]
	);

	return useMemo(() => {
		return isDeferred(children)
			? children({ deferred: getDeferredElement })
			: decorateItem(children);
	}, [children, decorateItem, getDeferredElement]);
};

export const ListItem: FC<IProps> = (props) => {
	const { children, href, selected } = props;

	const classes = useStyles({ href, selected });

	const { divider } = useContext(ListContext);

	const withHref = useWithHref(props, classes);
	const [listItemRef, withEffects] = useWithEffects(props);

	const [innerHandlers, outerHandlers] = useHandlers(props);

	const decorateItem = useCallback(flow(withHref, withEffects), [withHref, withEffects]);

	const childElement: ReactNode = useChildElement(props, decorateItem, innerHandlers, classes);

	const [isLastItem] = useIsLastChild(listItemRef);

	return (
		<li
			ref={listItemRef}
			className={classnames(classes.root, {
				[classes.padded]: !isDeferred(children)
			})}
			{...outerHandlers}
		>
			{childElement}
			{divider && !isLastItem && <Divider className={classes.divider} variant={divider} />}
		</li>
	);
};
