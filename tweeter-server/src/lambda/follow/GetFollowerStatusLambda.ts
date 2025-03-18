import { FollowerStatusRequest, FollowerStatusResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: FollowerStatusRequest): Promise<FollowerStatusResponse> => {
	const followService = new FollowService();
	const status = await followService.getIsFollowerStatus(
		request.token,
		request.user,
		request.selectedUser
	);

	return {
		success: true,
		message: null,
		status
	}
}