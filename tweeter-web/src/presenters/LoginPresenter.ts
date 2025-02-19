import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
	updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
	setLoadingState: (isLoading: boolean) => void;
	navigate: (path: string) => void;
}

export class LoginPresenter extends Presenter {
	private userService: UserService;
	private _rememberMe = false;

	public constructor(view: LoginView) {
		super(view);
		this.userService = new UserService();
	}

	public async login(alias: string, password: string, originalUrl?: string) {
		this.doFailureReportingOperation("log user in", async () => {
			this.view.setLoadingState(true);

			const [user, authToken] = await this.userService.login(alias, password);

			this.view.updateUserInfo(user, user, authToken, this._rememberMe);

			if (!!originalUrl) {
				this.view.navigate(originalUrl);
			} else {
				this.view.navigate("/");
			}
		}, () => {
			this.view.setLoadingState(false);
		});
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