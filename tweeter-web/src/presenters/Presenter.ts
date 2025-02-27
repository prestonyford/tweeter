import { AuthToken, User } from "tweeter-shared";

export interface View {
	displayErrorMessage: (message: string) => void;
}

export interface InfoMessageView extends View {
	displayInfoMessage: (message: string, duration: number, className?: string) => void;
	clearLastInfoMessage: () => void;
}

export interface LoadableView extends View {
	setLoadingState: (isLoading: boolean) => void;
}

export interface NavigableView extends View {
	navigate: (path: string) => void;
}

export interface UserInfoView extends View {
	updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
	clearUserInfo: () => void;
}

export class Presenter<V extends View> {
	private _view: V;

	protected constructor(view: V) {
		this._view = view;
	}

	protected get view(): V {
		return this._view;
	}

	protected async doFailureReportingOperation(
		operationDescription: string,
		operation: () => Promise<void>,
		finallyOperation?: (() => void)
	): Promise<void> {
		try {
			await operation();
		} catch (error) {
			this.view.displayErrorMessage(
				`Failed to ${operationDescription} because of exception: ${(error as Error).message}`
			);
		} finally {
			finallyOperation?.();
		}
	}
}
