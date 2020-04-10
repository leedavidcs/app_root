import { Toast, User } from "./generated";

export interface IClientState {
	modal: boolean;
	toasts: Maybe<readonly Toast[]>;
	user: Maybe<User>;
}

export const defaultState: IClientState = {
	modal: false,
	toasts: [],
	user: null
};
