import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { InfoMessageView, LoadableView, Presenter } from "./Presenter";

export interface PostStatusView extends LoadableView, InfoMessageView {
	setPost: (val: string) => void
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
	private _statusService: StatusService

	public constructor(view: PostStatusView) {
		super(view);
		this._statusService = new StatusService();
	}

	public get statusService() {
		return this._statusService;
	}

	public async submitPost(authToken: AuthToken, post: string, currentUser: User) {
		await this.doFailureReportingOperation("post the status", async () => {
			this.view.setLoadingState(true);
			this.view.displayInfoMessage("Posting status...", 0);

			const status = new Status(post, currentUser, Date.now());

			await this.statusService.postStatus(authToken!, status);

			this.clearPost();
			this.view.displayInfoMessage("Status posted!", 2000);
		}, () => {
			this.view.clearLastInfoMessage();
			this.view.setLoadingState(false);
		});
	}

	public clearPost() {
		this.view.setPost("");
	}

	public checkButtonStatus(post: string, authToken: AuthToken, currentUser: User) {
		return !post.trim() || !authToken || !currentUser;
	}
}