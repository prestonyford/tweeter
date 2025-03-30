import { AuthDAO } from "../dao/AuthDAO";
import { DAOFactory } from "../dao/DAOFactory";
import { UserDAO } from "../dao/UserDAO";

export abstract class Service {
	protected readonly authDAO: AuthDAO

	public constructor(daoFactory: DAOFactory) {
		this.authDAO = daoFactory.getAuthDAO();
	}
	
	protected async checkAuthorized(token: string): Promise<void> {
		const timestamp = await this.authDAO.getAuth(token);
		if (timestamp != null) {
			// TODO: CHECK EXPIRED
			return;
		}
		throw new Error("[Bad Request] Session timed out");
	}

	protected async getUserAlias(token: string): Promise<string> {
		const [alias, _] = await this.authDAO.getAuth(token) ?? [null, null];
		if (alias == null) {
			throw new Error("[Bad Request] Session timed out");
		}
		return alias;
	}
}