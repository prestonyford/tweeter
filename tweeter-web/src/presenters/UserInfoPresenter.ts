import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { InfoMessageView, LoadableView, Presenter, View } from "./Presenter";

export interface UserInfoView extends LoadableView, InfoMessageView {
	setDisplayedUser: (user: User) => void;
	setIsFollower: (val: boolean) => void;
	setFolloweeCount: (val: number) => void;
	setFollowerCount: (val: number) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
	private followService: FollowService

	public constructor(view: UserInfoView, currentUser: User | null, displayedUser: User | null) {
		super(view);
		this.followService = new FollowService();

		if (!displayedUser) {
			this.view.setDisplayedUser(currentUser!);
		}
	}

	private async follow (
		authToken: AuthToken,
		userToFollow: User
	): Promise<[followerCount: number, followeeCount: number]> {
		// Pause so we can see the follow message. Remove when connected to the server
		await new Promise((f) => setTimeout(f, 2000));

		// TODO: Call the server

		const followerCount = await this.followService.getFollowerCount(authToken, userToFollow);
		const followeeCount = await this.followService.getFolloweeCount(authToken, userToFollow);

		return [followerCount, followeeCount];
	};

	
	private async unfollow (
		authToken: AuthToken,
		userToUnfollow: User
	): Promise<[followerCount: number, followeeCount: number]> {
		// Pause so we can see the unfollow message. Remove when connected to the server
		await new Promise((f) => setTimeout(f, 2000));

		// TODO: Call the server

		const followerCount = await this.followService.getFollowerCount(authToken, userToUnfollow);
		const followeeCount = await this.followService.getFolloweeCount(authToken, userToUnfollow);

		return [followerCount, followeeCount];
	};

	public async setIsFollowerStatus(authToken: AuthToken, currentUser: User, displayedUser: User) {
		this.doFailureReportingOperation("determine follower status", async () => {
			if (currentUser === displayedUser) {
				this.view.setIsFollower(false);
			} else {
				this.view.setIsFollower(
					await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
				);
			}
		});
	}

	public async setNumbFollowees (
		authToken: AuthToken,
		displayedUser: User
	) {
		this.doFailureReportingOperation("get followees count", async () => {
			this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
		});
	};

	public async setNumbFollowers (
		authToken: AuthToken,
		displayedUser: User
	) {
		this.doFailureReportingOperation("get followers count", async () => {
			this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
		});
	};

	public switchToLoggedInUser(currentUser: User) {
		this.view.setDisplayedUser(currentUser);
	}

	public async followDisplayedUser(displayedUser: User, authToken: AuthToken) {
		this.doFailureReportingOperation("follow user", async () => {
			this.view.setLoadingState(true);
			this.view.displayInfoMessage(`Following ${displayedUser.name}...`, 0);

			const [followerCount, followeeCount] = await this.follow(
				authToken,
				displayedUser
			);

			this.view.setIsFollower(true);
			this.view.setFollowerCount(followerCount);
			this.view.setFolloweeCount(followeeCount);
		}, () => {
			this.view.clearLastInfoMessage();
			this.view.setLoadingState(false);
		});
	}

	public async unfollowDisplayedUser(displayedUser: User, authToken: AuthToken) {
		this.doFailureReportingOperation("unfollow user", async () => {
			this.view.setLoadingState(true);
			this.view.displayInfoMessage(
				`Unfollowing ${displayedUser!.name}...`,
				0
			);

			const [followerCount, followeeCount] = await this.unfollow(
				authToken,
				displayedUser
			);

			this.view.setIsFollower(false);
			this.view.setFollowerCount(followerCount);
			this.view.setFolloweeCount(followeeCount);
		}, () => {
			this.view.clearLastInfoMessage();
			this.view.setLoadingState(false);
		});
	}
}