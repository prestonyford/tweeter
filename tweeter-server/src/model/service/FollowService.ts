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
		this.checkAuthorized(token);
		return await this.followDAO.isFollower(user.alias, selectedUser.alias);
	};

	public async getFolloweeCount (
		token: string,
		user: UserDTO
	): Promise<number> {
		this.checkAuthorized(token);
		return await this.followDAO.getFolloweeCount(user.alias);
	};

	
	public async getFollowerCount (
		token: string,
		user: UserDTO
	): Promise<number> {
		this.checkAuthorized(token);
		return await this.followDAO.getFollowerCount(user.alias);
	};

	public async loadMoreFollowers(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDTO | null
	): Promise<[UserDTO[], boolean]> {
		this.checkAuthorized(token);
		const [aliases, hasMore] = await this.followDAO.getFollowers(userAlias, pageSize, lastItem?.alias ?? null);
		const users: UserDTO[] = [];

		aliases.forEach(async alias => {
			const userDTO = await this.userDAO.getUserInfo(alias);
			if (userDTO) {
				users.push(userDTO);
			}
		});

		return [users, hasMore];
	};

	public async loadMoreFollowees(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDTO | null
	): Promise<[UserDTO[], boolean]> {
		this.checkAuthorized(token);
		const [aliases, hasMore] = await this.followDAO.getFollowees(userAlias, pageSize, lastItem?.alias ?? null);
		const users: UserDTO[] = [];
		
		aliases.forEach(async alias => {
			const userDTO = await this.userDAO.getUserInfo(alias);
			if (userDTO) {
				users.push(userDTO);
			}
		});

		return [users, hasMore];
	};
	
	public async follow(
		token: string,
		userToFollow: UserDTO
	): Promise<void> {
		this.checkAuthorized(token);
		const alias = await this.getUserAlias(token);
		await this.followDAO.addFollow(userToFollow.alias, alias);
	}

	public async unfollow(
		token: string,
		userToUnfollow: UserDTO
	): Promise<void> {
		this.checkAuthorized(token);
		const alias = await this.getUserAlias(token);
		await this.followDAO.removeFollow(userToUnfollow.alias, alias);
	}
}
