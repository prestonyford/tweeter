import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LoginView {
	updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
	displayErrorMessage: (message: string) => void;
	setLoadingState: (isLoading: boolean) => void;
	navigate: (path: string) => void;
}

export class LoginPresenter {
	private userService: UserService;
	private view: LoginView;

	private _rememberMe = false;

	public constructor(view: LoginView) {
		this.userService = new UserService();
		this.view = view;
	}

	public async login(alias: string, password: string, originalUrl?: string) {
		try {
			this.view.setLoadingState(true);

			const [user, authToken] = await this.userService.login(alias, password);

			this.view.updateUserInfo(user, user, authToken, this._rememberMe);

			if (!!originalUrl) {
				this.view.navigate(originalUrl);
			} else {
				this.view.navigate("/");
			}
		} catch (error) {
			this.view.displayErrorMessage(
				`Failed to log user in because of exception: ${error}`
			);
		} finally {
			this.view.setLoadingState(false);
		}
	};

	public loginOnEnter(
		event: React.KeyboardEvent<HTMLElement>,
		alias: string,
		password: string,
		originalUrl?: string
	): void {
		if (event.key == "Enter" && !this.checkSubmitButtonStatus(alias, password)) {
			this.login(alias, password, originalUrl);
		}
	}
	
	public checkSubmitButtonStatus(alias: string, password: string): boolean {
		return !alias || !password;
	}

	public set rememberMe(value: boolean) {
		this._rememberMe = value;
	}
	
}