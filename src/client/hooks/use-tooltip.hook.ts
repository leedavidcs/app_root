import { createPopper, Instance, Options, VirtualElement } from "@popperjs/core";
import { MutableRefObject, useEffect, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect.hook";

export interface ITooltipLocation {
	x: number;
	y: number;
}

type TooltipReference = Element | VirtualElement;

interface IOptions {
	active?: boolean;
	reference: MutableRefObject<TooltipReference | null> | ITooltipLocation;
	popper: MutableRefObject<HTMLElement | null>;
	placement: Options["placement"];
}

const isLocation = (value: any): value is ITooltipLocation => {
	return typeof value?.x === "number" && typeof value?.y === "number";
};

const getLocationVirtialRef = ({ x, y }: ITooltipLocation): VirtualElement => ({
	getBoundingClientRect: () => ({
		top: y,
		bottom: y,
		left: x,
		right: x,
		width: 0,
		height: 0
	})
});

const getReferenceElement = (reference: IOptions["reference"]): TooltipReference | null => {
	return isLocation(reference) ? getLocationVirtialRef(reference) : reference.current;
};

export const useTooltip = ({
	active = true,
	reference: propsReference,
	popper: propsPopper,
	placement
}: IOptions) => {
	const popperInstanceRef = useRef<Instance | null>(null);

	useEffect(() => {
		const reference: TooltipReference | null = getReferenceElement(propsReference);
		const popper: HTMLElement | null = propsPopper.current;

		if (!reference || !popper) {
			return;
		}

		const popperInstance: Instance = createPopper(reference, popper, { placement });

		popperInstanceRef.current = popperInstance;

		return () => {
			popperInstance.destroy();
		};
	}, [propsReference, propsPopper, placement]);

	useIsomorphicLayoutEffect(() => {
		if (!popperInstanceRef.current) {
			return;
		}

		const popperInstance: Instance = popperInstanceRef.current;

		popperInstance.setOptions({ placement });
		popperInstance.update();
	}, [active, placement, propsPopper]);

	const updateFunc = popperInstanceRef.current?.update ?? (() => undefined);

	return {
		update: updateFunc
	};
};
