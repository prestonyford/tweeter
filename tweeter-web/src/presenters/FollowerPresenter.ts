import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FollowerPresenter extends UserItemPresenter {
	protected getItemDescription(): string {
		return "load followers";
	}
	protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
		return this.service.loadMoreFollowers(
			authToken,
			userAlias,
			PAGE_SIZE,
			this.lastItem
		);
	}
}
