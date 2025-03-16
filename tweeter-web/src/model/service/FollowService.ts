import { AuthToken, User, FakeData } from "tweeter-shared";
import { ServerFacade } from "../../net/ServerFacade";

export class FollowService {
	private serverFacade = new ServerFacade();

	public async getIsFollowerStatus (
		authToken: AuthToken,
		user: User,
		selectedUser: User
	): Promise<boolean> {
		// TODO: Replace with the result of calling server
		return FakeData.instance.isFollower();
	};

	public async getFolloweeCount (
		authToken: AuthToken,
		user: User
	): Promise<number> {
		// TODO: Replace with the result of calling server
		return FakeData.instance.getFolloweeCount(user.alias);
	};

	
	public async getFollowerCount (
		authToken: AuthToken,
		user: User
	): Promise<number> {
		// TODO: Replace with the result of calling server
		return FakeData.instance.getFollowerCount(user.alias);
	};

	public async loadMoreFollowers(
		authToken: AuthToken,
		userAlias: string,
		pageSize: number,
		lastItem: User | null
	): Promise<[User[], boolean]> {
		// TODO: Replace with the result of calling server
		return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
	};

	public async loadMoreFollowees(
		authToken: AuthToken,
		userAlias: string,
		pageSize: number,
		lastItem: User | null
	): Promise<[User[], boolean]> {
		return await this.serverFacade.getMoreFollowees({
			token: authToken.token,
			userAlias,
			pageSize,
			lastItem: lastItem?.dto ?? null
		})
		// return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
	};
}
