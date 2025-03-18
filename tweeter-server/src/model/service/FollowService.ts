import { AuthToken, User, FakeData, UserDTO } from "tweeter-shared";

export class FollowService {
	public async getIsFollowerStatus (
		token: string,
		user: UserDTO,
		selectedUser: UserDTO
	): Promise<boolean> {
		return FakeData.instance.isFollower();
	};

	public async getFolloweeCount (
		token: string,
		user: UserDTO
	): Promise<number> {
		return FakeData.instance.getFolloweeCount(user.alias);
	};

	
	public async getFollowerCount (
		token: string,
		user: UserDTO
	): Promise<number> {
		return FakeData.instance.getFollowerCount(user.alias);
	};

	public async loadMoreFollowers(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDTO | null
	): Promise<[UserDTO[], boolean]> {
		return this.getFakeFollowData(lastItem, pageSize, userAlias);
	};

	public async loadMoreFollowees(
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: UserDTO | null
	): Promise<[UserDTO[], boolean]> {
		return this.getFakeFollowData(lastItem, pageSize, userAlias);
	};

	private async getFakeFollowData(lastItem: UserDTO | null, pageSize: number, userAlias: string): Promise<[UserDTO[], boolean]> {
		const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
		const dtos = items.map(item => item.dto);
		return [dtos, hasMore];
	}
}
