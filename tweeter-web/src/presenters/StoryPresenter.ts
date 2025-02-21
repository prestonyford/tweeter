import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export const PAGE_SIZE = 10;

export class StoryPresenter extends StatusItemPresenter {
	protected override getItemDescription(): string {
		return "load story items";
	}
	protected override getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
		return this.service.loadMoreStoryItems(
			authToken,
			userAlias,
			PAGE_SIZE,
			this.lastItem
		);
	}
}