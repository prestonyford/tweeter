import { UserService } from "../model/service/UserService";
import { LoadableView, Presenter } from "./Presenter";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface LoginView extends LoadableView, AuthenticationView {
}

export class LoginPresenter extends AuthenticationPresenter<LoginView> {
	private userService: UserService;

	public constructor(view: LoginView) {
		super(view);
		this.userService = new UserService();
	}

	public async login(alias: string, password: string, originalUrl?: string) {
		await this.doFailureReportingOperation("log user in", async () => {
			this.view.setLoadingState(true);
			await this.doAuthenticateOperation(
				() => this.userService.login(alias, password),
				!!originalUrl ? originalUrl : "/"
			);
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
}