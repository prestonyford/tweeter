import { TweeterResponse, UnfollowRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: UnfollowRequest): Promise<TweeterResponse> => {
	const followService = new FollowService();
	await followService.unfollow(
		request.token,
		request.userToUnfollow
	);

	return {
		success: true,
		message: null
	}
}