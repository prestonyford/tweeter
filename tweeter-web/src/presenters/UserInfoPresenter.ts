import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export interface UserInfoView {
	setDisplayedUser: (user: User) => void;
	setIsFollower: (val: boolean) => void;
	setFolloweeCount: (val: number) => void;
	setFollowerCount: (val: number) => void;
	setLoadingState: (val: boolean) => void;
	displayErrorMessage: (message: string) => void;
	displayInfoMessage: (message: string, duration: number) => void;
	clearLastInfoMessage: () => void;
}

export class UserInfoPresenter {
	private followService: FollowService
	private view: UserInfoView

	public constructor(view: UserInfoView, currentUser: User | null, displayedUser: User | null) {
		this.followService = new FollowService();
		this.view = view;

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
		try {
			if (currentUser === displayedUser) {
				this.view.setIsFollower(false);
			} else {
				this.view.setIsFollower(
					await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
				);
			}
		} catch (error) {
			this.view.displayErrorMessage(
				`Failed to determine follower status because of exception: ${error}`
			);
		}
	}

	public async setNumbFollowees (
		authToken: AuthToken,
		displayedUser: User
	) {
		try {
			this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
		} catch (error) {
			this.view.displayErrorMessage(
				`Failed to get followees count because of exception: ${error}`
			);
		}
	};

	public async setNumbFollowers (
		authToken: AuthToken,
		displayedUser: User
	) {
		try {
			this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
		} catch (error) {
			this.view.displayErrorMessage(
				`Failed to get followers count because of exception: ${error}`
			);
		}
	};

	public switchToLoggedInUser(currentUser: User) {
		this.view.setDisplayedUser(currentUser);
	}

	public async followDisplayedUser(displayedUser: User, authToken: AuthToken) {
		try {
			this.view.setLoadingState(true);
			this.view.displayInfoMessage(`Following ${displayedUser.name}...`, 0);

			const [followerCount, followeeCount] = await this.follow(
				authToken,
				displayedUser
			);

			this.view.setIsFollower(true);
			this.view.setFollowerCount(followerCount);
			this.view.setFolloweeCount(followeeCount);
		} catch (error) {
			this.view.displayErrorMessage(
				`Failed to follow user because of exception: ${error}`
			);
		} finally {
			this.view.clearLastInfoMessage();
			this.view.setLoadingState(false);
		}
	}

	public async unfollowDisplayedUser(displayedUser: User, authToken: AuthToken) {
		try {
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
		} catch (error) {
			this.view.displayErrorMessage(
				`Failed to unfollow user because of exception: ${error}`
			);
		} finally {
			this.view.clearLastInfoMessage();
			this.view.setLoadingState(false);
		}
	}

}