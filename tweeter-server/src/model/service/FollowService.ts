import { User, FakeData, UserDTO } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/DAOFactory";
import { FollowDAO } from "../dao/FollowDAO";
import { UserDAO } from "../dao/UserDAO";

export class FollowService extends Service {
	private readonly followDAO: FollowDAO;
	private readonly userDAO: UserDAO;

	public constructor(daoFactory: DAOFactory) {
		super(daoFactory);
		this.followDAO = daoFactory.getFollowDAO();
		this.userDAO = daoFactory.getUserDAO();
	}

	public async getIsFollowerStatus (
		token: string,
		user: UserDTO,
		selectedUser: UserDTO
	): Promise<boolean> {
		await this.checkAuthorizedAndRenew(token);
		return await this.followDAO.isFollower(user.alias, selectedUser.alias);
	};

	public async getFolloweeCount (
		token: string,
		user: UserDTO
	): Promise<number> {
		await this.checkAuthorizedAndRenew(token);
		return await this.followDAO.getFolloweeCount(user.alias);
	};

	
	public async getFollowerCount (
		token: string,
		user: UserDTO
	): Promise<number> {
		await this.checkAuthorizedAndRenew(token);
		return await this.followDAO.getFollowerCount(user.alias);
	};

	public async loadMoreFollowers(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDTO | null
	): Promise<[UserDTO[], boolean]> {
		await this.checkAuthorizedAndRenew(token);
		const [aliases, hasMore] = await this.followDAO.getFollowers(userAlias, pageSize, lastItem?.alias ?? null);
		const users: UserDTO[] = await Promise.all(aliases.map(async alias => (await this.userDAO.getUserInfo(alias))!));

		return [users, hasMore];
	};

	public async loadMoreFollowees(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDTO | null
	): Promise<[UserDTO[], boolean]> {
		await this.checkAuthorizedAndRenew(token);
		const [aliases, hasMore] = await this.followDAO.getFollowees(userAlias, pageSize, lastItem?.alias ?? null);
		const users: UserDTO[] = await Promise.all(aliases.map(async alias => (await this.userDAO.getUserInfo(alias))!));

		return [users, hasMore];
	};
	
	public async follow(
		token: string,
		userToFollow: UserDTO
	): Promise<void> {
		await this.checkAuthorizedAndRenew(token);
		const alias = await this.getUserAlias(token);
		await this.followDAO.addFollow(userToFollow.alias, alias);
	}

	public async unfollow(
		token: string,
		userToUnfollow: UserDTO
	): Promise<void> {
		await this.checkAuthorizedAndRenew(token);
		const alias = await this.getUserAlias(token);
		await this.followDAO.removeFollow(userToUnfollow.alias, alias);
	}
}
