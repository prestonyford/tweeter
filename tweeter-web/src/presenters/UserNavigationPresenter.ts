import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
	setDisplayedUser: (user: User) => void;
	displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter {
	private userService: UserService;
	private view: UserNavigationView

	public constructor(view: UserNavigationView) {
		this.userService = new UserService();
		this.view = view;
	}

	private extractAlias(value: string): string {
		const index = value.indexOf("@");
		return value.substring(index);
	};

	public async navigateToUser(target: EventTarget, authToken: AuthToken, currentUser: User) {
		try {
			const alias = this.extractAlias(target.toString());

			const user = await this.userService.getUser(authToken, alias);

			if (!!user) {
				if (currentUser!.equals(user)) {
					this.view.setDisplayedUser(currentUser!);
				} else {
					this.view.setDisplayedUser(user);
				}
			}
		} catch (error) {
			this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
		}
	}
}