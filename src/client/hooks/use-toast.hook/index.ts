import { Classes, IToaster, Toaster } from "@blueprintjs/core";

let initialized = false;
let toaster: IToaster = {
	show: () => "",
	dismiss: () => undefined,
	clear: () => undefined,
	getToasts: () => []
};

export const useToast = (): IToaster => {
	if (initialized) {
		return toaster;
	}

	if (typeof window !== "undefined") {
		toaster = Toaster.create({
			className: Classes.DARK,
			maxToasts: 5,
			position: "bottom-left"
		});

		initialized = true;
	}

	return toaster;
};
