import { Classes, IToaster, Toaster } from "@blueprintjs/core";

const toaster: IToaster =
	typeof window !== "undefined"
		? Toaster.create({
				className: Classes.DARK,
				maxToasts: 5,
				position: "bottom-left"
		  })
		: {
				show: () => "",
				dismiss: () => undefined,
				clear: () => undefined,
				getToasts: () => []
		  };

export const useToast = (): IToaster => toaster;
