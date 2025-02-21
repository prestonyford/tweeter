import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export const PAGE_SIZE = 10;

export class FeedPresenter extends StatusItemPresenter {
	protected override getItemDescription(): string {
		return "load feed items";
	}
	protected override getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
		return this.service.loadMoreFeedItems(
			authToken,
			userAlias,
			PAGE_SIZE,
			this.lastItem
		);
	}
}