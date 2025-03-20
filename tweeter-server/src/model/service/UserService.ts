import { Buffer } from "buffer";
import { AuthTokenDTO, FakeData, UserDTO } from "tweeter-shared";

export class UserService {

	public async getUser(
		token: string,
		alias: string
	): Promise<UserDTO | null> {
		return FakeData.instance.findUserByAlias(alias)?.dto ?? null;
	};

	public async login(alias: string, password: string): Promise<[UserDTO, AuthTokenDTO]> {
		const user = FakeData.instance.firstUser;
		if (user === null) {
			throw new Error("[Bad Request] Invalid alias or password");
		}
		return [user.dto, FakeData.instance.authToken.dto];
	}

	public async register (
		firstName: string,
		lastName: string,
		alias: string,
		password: string,
		imageStringBase64: string,
		imageFileExtension: string
	): Promise<[UserDTO, AuthTokenDTO]> {
		const user = FakeData.instance.firstUser;
		if (user === null) {
			throw new Error("[Bad Request] Invalid registration");
		}
		return [user.dto, FakeData.instance.authToken.dto];
	};

	public async logout(token: string): Promise<void> {
		
	};
}