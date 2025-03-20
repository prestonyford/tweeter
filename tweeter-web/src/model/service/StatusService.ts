import { AuthToken, Status } from "tweeter-shared";
import { ServerFacade } from "../../net/ServerFacade";

export class StatusService {
	private serverFacade = new ServerFacade();

	public async postStatus(
		authToken: AuthToken,
		newStatus: Status
	): Promise<void> {
		await this.serverFacade.postStatus({
			token: authToken.token,
			newStatus
		});
	};

	public async loadMoreFeedItems (
		authToken: AuthToken,
		userAlias: string,
		pageSize: number,
		lastItem: Status | null
	): Promise<[Status[], boolean]> {
		return await this.serverFacade.loadMoreFeedItems({
			token: authToken.token,
			userAlias,
			pageSize,
			lastItem: lastItem?.dto ?? null
		});
		// return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
	};

	public async loadMoreStoryItems (
		authToken: AuthToken,
		userAlias: string,
		pageSize: number,
		lastItem: Status | null
	): Promise<[Status[], boolean]> {
		return await this.serverFacade.loadMoreStoryItems({
			token: authToken.token,
			userAlias,
			pageSize,
			lastItem: lastItem?.dto ?? null
		});
		// return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
	};
}