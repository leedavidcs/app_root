import { GetViewerQuery, Toast } from "./generated";

export interface IClientState {
	modal: boolean;
	toasts: Maybe<readonly Toast[]>;
	user: GetViewerQuery["viewer"];
}

export const defaultState: IClientState = {
	modal: false,
	toasts: [],
	user: null
};
