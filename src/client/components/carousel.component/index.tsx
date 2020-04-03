import { Icon } from "@blueprintjs/core";
import classnames from "classnames";
import { range } from "lodash";
import React, {
	CSSProperties,
	FC,
	memo,
	ReactElement,
	ReactNodeArray,
	useCallback,
	useMemo
} from "react";
import { ISlideProps, Slide } from "./slide.component";
import { useStyles } from "./styles";

const BASE_WIDTH_PERCENT = 100;

interface IProps {
	activeSlide: number;
	children: ReactNodeArray;
	className?: string;
	onChangeSlide?: (index: number) => void;
	showDots?: boolean;
	style?: CSSProperties;
}

interface IWithStaticProps {
	Slide: typeof Slide;
}

const isSlideElement = (value: any): value is ReactElement<ISlideProps> => {
	return React.isValidElement(value) && value.type === Slide;
};

const BaseCarousel: FC<IProps> = memo(
	({ activeSlide, children, className, onChangeSlide, showDots = true, style }) => {
		const classes = useStyles();

		const childrenArray: ReactNodeArray = useMemo(() => React.Children.toArray(children), [
			children
		]);

		const baseTranslate: number = BASE_WIDTH_PERCENT / childrenArray.length;

		const slides: readonly ReactElement<ISlideProps>[] = useMemo(() => {
			return childrenArray.map((slide, index) => {
				if (!isSlideElement(slide)) {
					throw new Error("Carousel contains a non Slide element as a child.");
				}

				return React.cloneElement(slide, {
					key: index,
					style: { ...slide.props.style, flexBasis: `${baseTranslate}%` }
				});
			});
		}, [baseTranslate, childrenArray]);

		const onClickNewPage = useCallback((index: number) => () => onChangeSlide?.(index), [
			onChangeSlide
		]);

		return (
			<div className={classnames(classes.root, className)} style={style}>
				<div className={classes.content}>
					<div
						className={classes.contentSlide}
						style={{
							width: `${slides.length * BASE_WIDTH_PERCENT}%`,
							transform: `translateX(-${baseTranslate * activeSlide}%)`
						}}
					>
						{slides}
					</div>
				</div>
				{showDots && (
					<ul className={classes.dots}>
						{range(slides.length).map((_, i) => (
							<li key={i} onClick={onClickNewPage(i)}>
								<Icon
									icon="full-circle"
									intent={activeSlide === i ? "primary" : "none"}
									iconSize={12}
								/>
							</li>
						))}
					</ul>
				)}
			</div>
		);
	}
);

BaseCarousel.displayName = "Carousel";

(BaseCarousel as FC<IProps> & IWithStaticProps).Slide = Slide;

export const Carousel = BaseCarousel as FC<IProps> & IWithStaticProps;
