import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


export interface AppNavbarView {
	displayInfoMessage: (message: string, duration: number) => void;
	displayErrorMessage: (message: string) => void;
	clearLastInfoMessage: () => void;
	clearUserInfo: () => void;
}

export class AppNavbarPresenter {
	private userService: UserService
	private _view: AppNavbarView

	public constructor(view: AppNavbarView) {
		this.userService = new UserService();
		this._view = view;
	}

	public async logout(authToken: AuthToken) {
		this._view.displayInfoMessage("Logging Out...", 0);

		try {
			await this.userService.logout(authToken!);

			this._view.clearLastInfoMessage();
			this._view.clearUserInfo();
		} catch (error) {
			this._view.displayErrorMessage(
				`Failed to log user out because of exception: ${error}`
			);
		}
	}
}