import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";


export interface AppNavbarView extends View {
	displayInfoMessage: (message: string, duration: number) => void;
	clearLastInfoMessage: () => void;
	clearUserInfo: () => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
	private userService: UserService

	public constructor(view: AppNavbarView) {
		super(view);
		this.userService = new UserService();
	}

	public async logout(authToken: AuthToken) {
		this.view.displayInfoMessage("Logging Out...", 0);

		this.doFailureReportingOperation("log user out", async () => {
			await this.userService.logout(authToken!);

			this.view.clearLastInfoMessage();
			this.view.clearUserInfo();
		});
	}
}