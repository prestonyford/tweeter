import { Buffer } from "buffer";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { ServerFacade } from "../../net/ServerFacade";

export class UserService {
	private serverFacade = new ServerFacade();

	public async getUser(
		authToken: AuthToken,
		alias: string
	): Promise<User | null> {
		return await this.serverFacade.getUser({
			token: authToken.token,
			alias
		});
		// return FakeData.instance.findUserByAlias(alias);
	};

	public async login(alias: string, password: string): Promise<[User, AuthToken]> {
		return await this.serverFacade.login({
			alias,
			password
		});
		// return [user, FakeData.instance.authToken];
	}

	public async register (
		firstName: string,
		lastName: string,
		alias: string,
		password: string,
		userImageBytes: Uint8Array,
		imageFileExtension: string
	): Promise<[User, AuthToken]> {
		const imageStringBase64: string =
			Buffer.from(userImageBytes).toString("base64");

		return await this.serverFacade.register({
			firstName,
			lastName,
			alias,
			password,
			imageStringBase64,
			imageFileExtension
		});
		// return [user, FakeData.instance.authToken];
	};

	public async logout(authToken: AuthToken): Promise<void> {
		this.serverFacade.logout({
			token: authToken.token
		});
	};
}
