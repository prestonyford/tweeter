import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { Presenter, View } from "./Presenter";

export interface PostStatusView extends View {
	setLoadingState: (isLoading: boolean) => void,
	displayInfoMessage: (message: string, duration: number) => void,
	clearLastInfoMessage: () => void,
	setPost: (val: string) => void
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
	private statusService: StatusService

	public constructor(view: PostStatusView) {
		super(view);
		this.statusService = new StatusService();
	}

	public async submitPost(authToken: AuthToken, post: string, currentUser: User) {
		this.doFailureReportingOperation("post the status", async () => {
			this.view.setLoadingState(true);
			this.view.displayInfoMessage("Posting status...", 0);

			const status = new Status(post, currentUser, Date.now());

			await this.statusService.postStatus(authToken!, status);

			this.view.setPost("");
			this.view.displayInfoMessage("Status posted!", 2000);
		}, () => {
			this.view.clearLastInfoMessage();
			this.view.setLoadingState(false);
		});
	}

	public setPost(val: string) {
		this.view.setPost(val);
	}

	public clearPost() {
		this.view.setPost("");
	}

	public checkButtonStatus(post: string, authToken: AuthToken, currentUser: User) {
		return !post.trim() || !authToken || !currentUser;
	}
}