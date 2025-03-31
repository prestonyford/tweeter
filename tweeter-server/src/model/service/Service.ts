import { AuthDAO } from "../dao/AuthDAO";
import { DAOFactory } from "../dao/DAOFactory";
import { ServiceException } from "./exception/ServiceException";

export abstract class Service {
	private static TIMEOUT_MINS = 30;
	protected readonly authDAO: AuthDAO

	public constructor(daoFactory: DAOFactory) {
		this.authDAO = daoFactory.getAuthDAO();
	}

	private isTimedOut(timestamp: number): boolean {
		const TIMEOUT_MS = Service.TIMEOUT_MINS * 60 * 1000;
    	return Math.abs(Date.now() - timestamp) > TIMEOUT_MS;
	}

	protected async renewAuth(token: string): Promise<void> {
		this.authDAO.renewAuth(token, Date.now());
	}
	
	protected async checkAuthorizedAndRenew(token: string): Promise<void> {
		const [alias, timestamp] = await this.authDAO.getAuth(token) ?? [null, null];
		if (alias == null || timestamp == null || this.isTimedOut(timestamp)) {
			if (alias != null) {
				try {
					await this.authDAO.deleteAuth(token);
				} catch {
					throw new ServiceException(500, "Server error while verifying authentication");
				}
			}
			throw new ServiceException(400, "Session timed out");
		} else {
			await this.renewAuth(token);
		}
	}

	protected async getUserAlias(token: string): Promise<string> {
		const [alias, _] = await this.authDAO.getAuth(token) ?? [null, null];
		if (alias == null) {
			throw new ServiceException(400, "Session timed out");
		}
		return alias;
	}
}