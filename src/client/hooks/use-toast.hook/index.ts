import { Classes, IToaster, Toaster } from "@blueprintjs/core";

const toaster: IToaster = Toaster.create({
	className: Classes.DARK,
	maxToasts: 5,
	position: "bottom-left"
});

export const useToast = (): IToaster => toaster;
