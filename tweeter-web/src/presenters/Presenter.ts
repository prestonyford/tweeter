export interface View {
	displayErrorMessage: (message: string) => void;
}

export interface ToasterView extends View {
	// ???
}

export class Presenter {
	private _view: View;

	protected constructor(view: View) {
		this._view = view;
	}

	protected get view(): View {
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
