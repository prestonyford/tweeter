import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, UserInfoView, View, InfoMessageView } from "./Presenter";


export interface AppNavbarView extends InfoMessageView, UserInfoView {
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