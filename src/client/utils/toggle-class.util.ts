export const toggleClass = (elem: Element, className: string, force?: boolean): void => {
	className.split(" ").forEach((classPartial) => elem.classList.toggle(classPartial, force));
};
