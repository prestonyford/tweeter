export interface View {
	displayErrorMessage: (message: string) => void;
}

export interface ToasterView extends View {
	// ???
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
				`Failed to ${operationDescription} because of exception: ${error}`
			);
		} finally {
			finallyOperation?.();
		}
	}
}
