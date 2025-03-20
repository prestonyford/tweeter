import { Status, FakeData, StatusDTO } from "tweeter-shared";

export class StatusService {
	public async postStatus(
		token: string,
		newStatus: StatusDTO
	): Promise<void> {

	};

	public async loadMoreFeedItems (
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: StatusDTO | null
	): Promise<[StatusDTO[], boolean]> {
		return this.getFakeStatusData(lastItem, pageSize);
	};

	public async loadMoreStoryItems (
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: StatusDTO | null
	): Promise<[StatusDTO[], boolean]> {
		return this.getFakeStatusData(lastItem, pageSize);
	};

	private async getFakeStatusData(lastItem: StatusDTO | null, pageSize: number): Promise<[StatusDTO[], boolean]> {
		const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
		const dtos = items.map(item => item.dto);
		return [dtos, hasMore];
	}
}