import { AuthToken, AuthTokenDTO, UserDTO } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";
import { UserDAO } from "../dao/UserDAO";
import { ImageDAO } from "../dao/ImageDAO";
import bcrypt from "bcryptjs"
import { Service } from "./Service";
import { ServiceException } from "./exception/ServiceException";

export class UserService extends Service {
	private userDAO: UserDAO;
	private imageDAO: ImageDAO;

	public constructor(daoFactory: DAOFactory, imageDAO: ImageDAO) {
		super(daoFactory);
		this.userDAO = daoFactory.getUserDAO();
		this.imageDAO = imageDAO;
	}

	public async getUser(
		token: string,
		alias: string
	): Promise<UserDTO | null> {
		await this.checkAuthorizedAndRenew(token);

		const user = await this.userDAO.getUserInfo(alias);
		return user;
	};

	public async login(alias: string, password: string): Promise<[UserDTO, AuthTokenDTO]> {
		const user = await this.userDAO.getUserInfo(alias);
		const hashedPassword = await this.userDAO.getUserCredentials(alias);

		if (!user || !hashedPassword) {
			throw new ServiceException(400, "Invalid alias or password");
		}
		if (!await bcrypt.compare(password, hashedPassword)) {
			throw new ServiceException(400, "Invalid alias or password");
		}

		const token = AuthToken.Generate().dto
		await this.authDAO.putAuth(token, alias);

		return [user, token];
	}

	public async register (
		firstName: string,
		lastName: string,
		alias: string,
		password: string,
		imageStringBase64: string,
		imageFileExtension: string
	): Promise<[UserDTO, AuthTokenDTO]> {
		if (await this.userDAO.getUserInfo(alias)) {
			throw new ServiceException(400, "User with the given alias already exists");
		}

		const imageUrl = await this.imageDAO.putImage(`${alias}-profile.${imageFileExtension}`, imageStringBase64);

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);
		const authToken = AuthToken.Generate().dto;

		await this.userDAO.putUser({ firstName, lastName, alias, imageUrl }, passwordHash);
		await this.authDAO.putAuth(authToken, alias);

		const user = await this.userDAO.getUserInfo(alias);

		if (!user) {
			throw new ServiceException(500, "Could not create the user");
		}

		return [user, authToken];
	};

	public async logout(token: string): Promise<void> {
		await this.authDAO.deleteAuth(token)
	};
}