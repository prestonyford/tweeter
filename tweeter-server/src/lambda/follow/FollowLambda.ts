import { FollowRequest, TweeterResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: FollowRequest): Promise<TweeterResponse> => {
	const followService = new FollowService();
	await followService.follow(
		request.token,
		request.userToFollow
	);

	return {
		success: true,
		message: null
	}
}