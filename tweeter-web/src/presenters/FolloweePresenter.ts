import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
	protected override getItemDescription(): string {
		return "load followees";
	}
	protected override getMoreItems(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
		return this.service.loadMoreFollowees(
			authToken,
			userAlias,
			PAGE_SIZE,
			this.lastItem
		);
	}
}
