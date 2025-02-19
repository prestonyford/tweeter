import { Toast } from "../components/toaster/Toast";

export interface ToasterView {
	deleteToast: (id: string) => void;
}

export class ToasterPresenter {
	private view: ToasterView
	private interval: number | null;

	public constructor(view: ToasterView) {
		this.view = view;
		this.interval = null;
	}

	private deleteExpiredToasts(toastList: Toast[]) {
		const now = Date.now();

		for (let toast of toastList) {
			if (
				toast.expirationMillisecond > 0 &&
				toast.expirationMillisecond < now
			) {
				this.view.deleteToast(toast.id);
			}
		}
	};

	public setupExpiredToastInterval(toastList: Toast[]) {
		this.interval = setInterval(() => {
			if (toastList.length) {
				this.deleteExpiredToasts(toastList);
			}
		}, 1000);
	}

	public clearExpiredToastInterval() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}
}