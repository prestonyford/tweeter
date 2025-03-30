import { TweeterResponse, UnfollowRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";

export const handler = async (request: UnfollowRequest): Promise<TweeterResponse> => {
	const followService = new FollowService(new DynamoDBDAOFactory());
	await followService.unfollow(
		request.token,
		request.userToUnfollow
	);

	return {
		success: true,
		message: null
	}
}