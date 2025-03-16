import { AuthToken, User, FakeData, UserDTO } from "tweeter-shared";

export class FollowService {
	public async getIsFollowerStatus (
		token: string,
		user: User,
		selectedUser: UserDTO
	): Promise<boolean> {
		// TODO: Replace with the result of calling server
		return FakeData.instance.isFollower();
	};

	public async getFolloweeCount (
		token: string,
		user: UserDTO
	): Promise<number> {
		// TODO: Replace with the result of calling server
		return FakeData.instance.getFolloweeCount(user.alias);
	};

	
	public async getFollowerCount (
		token: string,
		user: UserDTO
	): Promise<number> {
		// TODO: Replace with the result of calling server
		return FakeData.instance.getFollowerCount(user.alias);
	};

	public async loadMoreFollowers(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDTO | null
	): Promise<[UserDTO[], boolean]> {
		// TODO: Replace with the result of calling server
		return this.getFakeData(lastItem, pageSize, userAlias);
	};

	public async loadMoreFollowees(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDTO | null
	): Promise<[UserDTO[], boolean]> {
		// TODO: Replace with the result of calling server
		return this.getFakeData(lastItem, pageSize, userAlias);
	};

	private async getFakeData(lastItem: UserDTO | null, pageSize: number, userAlias: string): Promise<[UserDTO[], boolean]> {
		const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
		const dtos = items.map(item => item.dto);
		return [dtos, hasMore];
	}
}
