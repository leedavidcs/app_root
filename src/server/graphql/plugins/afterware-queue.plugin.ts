import { IServerContext } from "@/server/graphql/context";
import { ApolloServerPlugin } from "apollo-server-plugin-base";

export class AfterwareQueue {
	private queue: readonly (() => Promise<void> | void)[] = [];

	public add(fn: () => Promise<void> | void) {
		this.queue = [...this.queue, fn];
	}

	public async all(): Promise<void> {
		for (const fn of this.queue) {
			await fn();
		}

		this.queue = [];
	}
}

export const afterwarePlugin: ApolloServerPlugin<IServerContext> = {
	requestDidStart: () => {
		return {
			willSendResponse: async ({ context: { afterwares }, errors }) => {
				if (errors) {
					return;
				}

				await afterwares.all();
			}
		};
	}
};
