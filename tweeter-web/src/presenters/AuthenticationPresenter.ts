import { AuthToken, User } from "tweeter-shared";
import { Presenter, UserInfoView, View } from "./Presenter";

export interface AuthenticationView extends UserInfoView {}

export abstract class AuthenticationPresenter<V extends AuthenticationView> extends Presenter<V> {
	protected _rememberMe = false;

	protected async doAuthenticateOperation(operation: () => Promise<[User, AuthToken]>, navigateTo: string) {
		const [user, authToken] = await operation();
		this.view.updateUserInfo(user, user, authToken, this._rememberMe);
		this.view.navigate(navigateTo);
	}
	
	public set rememberMe(value: boolean) {
		this._rememberMe = value;
	}
}